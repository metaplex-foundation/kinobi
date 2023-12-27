import { Node, isDataEnum, isEnumTypeNode } from '../../nodes';
import {
  NodeStack,
  ValidatorBag,
  camelCase,
  pascalCase,
  titleCase,
} from '../../shared';
import { Visitor, interceptVisitor, mergeVisitor } from '../../visitors';

export function getJavaScriptValidatorBagVisitor(): Visitor<ValidatorBag> {
  const exportMap: Map<
    string,
    { node: Node; stack: NodeStack; exportType: string }
  > = new Map();
  const stack = new NodeStack();
  const visitor = interceptVisitor(
    mergeVisitor(
      () => new ValidatorBag(),
      (_, bags) => new ValidatorBag().mergeWith(bags)
    ),
    (node, next) => {
      stack.push(node);
      const newNode = next(node);
      stack.pop();
      return newNode;
    }
  );
  const baseVisitor = { ...visitor };

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

  visitor.visitProgram = (node) => {
    const bag = new ValidatorBag();
    const pascalCaseName = pascalCase(node.name);
    bag.mergeWith([
      checkExportConflicts(node, {
        [`get${pascalCaseName}Program`]: 'function',
        [`get${pascalCaseName}ErrorFromCode`]: 'function',
        [`get${pascalCaseName}ErrorFromName`]: 'function',
      }),
    ]);
    return bag.mergeWith([baseVisitor.visitProgram.bind(visitor)(node)]);
  };

  visitor.visitAccount = (node) => {
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
    if (node.seeds.length > 0) {
      exports[`find${pascalCaseName}Pda`] = 'function';
      exports[`fetch${pascalCaseName}FromSeeds`] = 'function';
      exports[`safeFetch${pascalCaseName}FromSeeds`] = 'function';
    }
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
    return bag.mergeWith([baseVisitor.visitAccount.bind(visitor)(node)]);
  };

  visitor.visitInstruction = (node) => {
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
    return bag.mergeWith([baseVisitor.visitInstruction.bind(visitor)(node)]);
  };

  visitor.visitDefinedType = (node) => {
    const bag = new ValidatorBag();
    const camelCaseName = camelCase(node.name);
    const pascalCaseName = pascalCase(node.name);
    if (!node.internal) {
      bag.mergeWith([
        checkExportConflicts(node, {
          [pascalCaseName]: 'type',
          [`${pascalCaseName}Args`]: 'type',
          [`fetch${pascalCaseName}`]: 'function',
          ...(isEnumTypeNode(node.data) && isDataEnum(node.data)
            ? {
                [camelCaseName]: 'function',
                [`is${pascalCaseName}`]: 'function',
              }
            : {}),
        }),
      ]);
    }
    return bag.mergeWith([baseVisitor.visitDefinedType.bind(visitor)(node)]);
  };

  visitor.visitError = (node) => {
    const bag = new ValidatorBag();
    const program = stack.getProgram();
    const prefixedName =
      pascalCase(program?.prefix ?? '') + pascalCase(node.name);
    bag.mergeWith([
      checkExportConflicts(node, {
        [`${prefixedName}Error`]: 'class',
      }),
    ]);
    return bag.mergeWith([baseVisitor.visitError.bind(visitor)(node)]);
  };

  return visitor;
}
