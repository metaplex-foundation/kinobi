import { Node, isDataEnum, isNode } from '../../nodes';
import {
  NodeStack,
  ValidatorBag,
  camelCase,
  pascalCase,
  pipe,
  titleCase,
} from '../../shared';
import {
  Visitor,
  extendVisitor,
  mergeVisitor,
  recordNodeStackVisitor,
} from '../../visitors';

export function getValidatorBagVisitor(): Visitor<ValidatorBag> {
  const exportMap: Map<
    string,
    { node: Node; stack: NodeStack; exportType: string }
  > = new Map();
  const stack = new NodeStack();

  const isEponymousExport = (node: Node, exportName: string): boolean =>
    exportName === ('name' in node ? node.name : '');

  const getNodeTitle = (node: Node): string => {
    const name = 'name' in node ? node.name : '';
    const type = titleCase(node.kind.slice(0, -4)).toLowerCase();
    return `"${name}" ${type}`;
  };

  const checkExportConflicts = (
    node: Node,
    exports: Record<string, string>
  ): ValidatorBag => {
    const bag = new ValidatorBag();
    const conflictingNodes: Node[] = [];
    Object.entries(exports).forEach(([exportName, exportType]) => {
      // Checks for conflicts.
      const exportConflict = exportMap.get(exportName);
      if (!exportConflict) {
        exportMap.set(exportName, { node, stack: stack.clone(), exportType });
        return;
      }

      // Avoids throwing many similar error for the same kind of conflict.
      const conflictingNode = exportConflict.node;
      if (conflictingNodes.includes(conflictingNode)) return;
      conflictingNodes.push(conflictingNode);

      // Constructs the error message.
      let exportDetails = '';
      let conflictExportDetails = '';
      if (!isEponymousExport(node, exportName)) {
        exportDetails = `exports a "${exportName}" ${exportType} that `;
      }
      if (!isEponymousExport(conflictingNode, exportName)) {
        conflictExportDetails = `"${exportName}" ${exportConflict.exportType} exported by the `;
      }
      const message =
        `The ${getNodeTitle(node)} ${exportDetails}` +
        `conflicts with the ${conflictExportDetails}` +
        `${getNodeTitle(conflictingNode)}.\n` +
        `|> Conflicting stack: ${exportConflict.stack}.`;
      bag.error(message, node, stack);
    });
    return bag;
  };

  return pipe(
    mergeVisitor(
      () => new ValidatorBag(),
      (_, bags) => new ValidatorBag().mergeWith(bags)
    ),
    (v) => recordNodeStackVisitor(v, stack),
    (v) =>
      extendVisitor(v, {
        visitProgram(node, { next }) {
          const bag = new ValidatorBag();
          const pascalCaseName = pascalCase(node.name);
          bag.mergeWith([
            checkExportConflicts(node, {
              [`get${pascalCaseName}Program`]: 'function',
              [`get${pascalCaseName}ErrorFromCode`]: 'function',
              [`get${pascalCaseName}ErrorFromName`]: 'function',
            }),
          ]);
          return bag.mergeWith([next(node)]);
        },

        visitAccount(node, { next }) {
          const bag = new ValidatorBag();
          const pascalCaseName = pascalCase(node.name);
          const exports = {
            [pascalCaseName]: 'type',
            [`${pascalCaseName}AccountData`]: 'type',
            [`${pascalCaseName}AccountDataArgs`]: 'type',
            [`fetch${pascalCaseName}`]: 'function',
            [`safeFetch${pascalCaseName}`]: 'function',
            [`deserialize${pascalCaseName}`]: 'function',
            [`get${pascalCaseName}AccountDataSerializer`]: 'function',
            [`get${pascalCaseName}GpaBuilder`]: 'function',
            [`get${pascalCaseName}Size`]: 'function',
          };
          if (!node.internal) {
            bag.mergeWith([checkExportConflicts(node, exports)]);
          }

          const reservedAccountFields = new Set(['publicKey', 'header']);
          if (!node.data.link) {
            const invalidFields = node.data.struct.fields
              .map((field) => field.name)
              .filter((name) => reservedAccountFields.has(name));
            if (invalidFields.length > 0) {
              const x = invalidFields.join(', ');
              const message =
                invalidFields.length === 1
                  ? `Account field [${x}] is reserved. Please rename it.`
                  : `Account fields [${x}] are reserved. Please rename them.`;
              bag.error(message, node, stack);
            }
          }
          return bag.mergeWith([next(node)]);
        },

        visitInstruction(node, { next }) {
          const bag = new ValidatorBag();
          const camelCaseName = camelCase(node.name);
          const pascalCaseName = pascalCase(node.name);
          const pascalCaseData = pascalCase(node.dataArgs.name);
          const pascalCaseExtra = pascalCase(node.extraArgs.name);
          if (!node.internal) {
            bag.mergeWith([
              checkExportConflicts(node, {
                [camelCaseName]: 'function',
                [`${pascalCaseName}InstructionAccounts`]: 'type',
                [`${pascalCaseName}InstructionArgs`]: 'type',
                [`${pascalCaseData}`]: 'type',
                [`${pascalCaseData}Args`]: 'type',
                [`get${pascalCaseData}Serializer`]: 'function',
                [`${pascalCaseExtra}Args`]: 'type',
              }),
            ]);
          }
          return bag.mergeWith([next(node)]);
        },

        visitDefinedType(node, { next }) {
          const bag = new ValidatorBag();
          const camelCaseName = camelCase(node.name);
          const pascalCaseName = pascalCase(node.name);
          if (!node.internal) {
            bag.mergeWith([
              checkExportConflicts(node, {
                [pascalCaseName]: 'type',
                [`${pascalCaseName}Args`]: 'type',
                [`fetch${pascalCaseName}`]: 'function',
                ...(isNode(node.type, 'enumTypeNode') && isDataEnum(node.type)
                  ? {
                      [camelCaseName]: 'function',
                      [`is${pascalCaseName}`]: 'function',
                    }
                  : {}),
              }),
            ]);
          }
          return bag.mergeWith([next(node)]);
        },

        visitError(node, { next }) {
          const bag = new ValidatorBag();
          const program = stack.getProgram();
          const prefixedName =
            pascalCase(program?.prefix ?? '') + pascalCase(node.name);
          bag.mergeWith([
            checkExportConflicts(node, {
              [`${prefixedName}Error`]: 'class',
            }),
          ]);
          return bag.mergeWith([next(node)]);
        },
      })
  );
}
