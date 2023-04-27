import { camelCase, pascalCase, titleCase } from '../../shared';
import * as nodes from '../../nodes';
import {
  GetDefaultValidatorBagVisitor,
  NodeStack,
  ValidatorBag,
} from '../../visitors';

export class GetJavaScriptValidatorBagVisitor extends GetDefaultValidatorBagVisitor {
  protected exportMap: Map<
    string,
    { node: nodes.Node; stack: NodeStack; exportType: string }
  > = new Map();

  visitRoot(root: nodes.RootNode): ValidatorBag {
    return super.visitRoot(root);
  }

  visitProgram(program: nodes.ProgramNode): ValidatorBag {
    const bag = super.visitProgram(program);
    this.pushNode(program);
    const pascalCaseName = pascalCase(program.name);
    bag.mergeWith([
      this.checkExportConflicts(program, {
        [`get${pascalCaseName}Program`]: 'function',
        [`get${pascalCaseName}ErrorFromCode`]: 'function',
        [`get${pascalCaseName}ErrorFromName`]: 'function',
      }),
    ]);
    this.popNode();
    return bag;
  }

  visitAccount(account: nodes.AccountNode): ValidatorBag {
    const bag = super.visitAccount(account);
    this.pushNode(account);
    const pascalCaseName = pascalCase(account.name);
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
    if (account.seeds.length > 0) {
      exports[`find${pascalCaseName}Pda`] = 'function';
      exports[`fetch${pascalCaseName}FromSeeds`] = 'function';
      exports[`safeFetch${pascalCaseName}FromSeeds`] = 'function';
    }
    if (!account.internal) {
      bag.mergeWith([this.checkExportConflicts(account, exports)]);
    }

    const reservedAccountFields = new Set(['publicKey', 'header']);
    if (!account.data.link) {
      const invalidFields = account.data.struct.fields
        .map((field) => field.name)
        .filter((name) => reservedAccountFields.has(name));
      if (invalidFields.length > 0) {
        const x = invalidFields.join(', ');
        const message =
          invalidFields.length === 1
            ? `Account field [${x}] is reserved. Please rename it.`
            : `Account fields [${x}] are reserved. Please rename them.`;
        bag.error(message, account, this.stack);
      }
    }
    this.popNode();
    return bag;
  }

  visitInstruction(instruction: nodes.InstructionNode): ValidatorBag {
    const bag = super.visitInstruction(instruction);
    this.pushNode(instruction);
    const camelCaseName = camelCase(instruction.name);
    const pascalCaseName = pascalCase(instruction.name);
    const pascalCaseData = pascalCase(instruction.dataArgs.name);
    const pascalCaseExtra = pascalCase(instruction.extraArgs.name);
    if (!instruction.internal) {
      bag.mergeWith([
        this.checkExportConflicts(instruction, {
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
    this.popNode();
    return bag;
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): ValidatorBag {
    const bag = super.visitDefinedType(definedType);
    this.pushNode(definedType);
    const isDataEnum =
      nodes.isEnumTypeNode(definedType.data) &&
      nodes.isDataEnum(definedType.data);
    const camelCaseName = camelCase(definedType.name);
    const pascalCaseName = pascalCase(definedType.name);
    if (!definedType.internal) {
      bag.mergeWith([
        this.checkExportConflicts(definedType, {
          [pascalCaseName]: 'type',
          [`${pascalCaseName}Args`]: 'type',
          [`fetch${pascalCaseName}`]: 'function',
          ...(isDataEnum
            ? {
                [camelCaseName]: 'function',
                [`is${pascalCaseName}`]: 'function',
              }
            : {}),
        }),
      ]);
    }
    this.popNode();
    return bag;
  }

  visitError(error: nodes.ErrorNode): ValidatorBag {
    const bag = super.visitError(error);
    this.pushNode(error);
    const prefixedName =
      pascalCase(this.program?.prefix ?? '') + pascalCase(error.name);
    bag.mergeWith([
      this.checkExportConflicts(error, {
        [`${prefixedName}Error`]: 'class',
      }),
    ]);
    this.popNode();
    return bag;
  }

  visitNumberWrapperType(
    numberWrapperType: nodes.NumberWrapperTypeNode
  ): ValidatorBag {
    const bag = super.visitNumberWrapperType(numberWrapperType);
    this.pushNode(numberWrapperType);
    const { wrapper, number } = numberWrapperType;
    switch (wrapper.kind) {
      case 'DateTime':
        if (!nodes.isInteger(number)) {
          bag.error(
            `DateTime wrapper can only be applied to integer types. ` +
              `Got type [${nodes.displayNumberTypeNode(number)}].`,
            numberWrapperType,
            this.stack
          );
        }
        break;
      case 'Amount':
        if (!nodes.isUnsignedInteger(number)) {
          bag.error(
            `Amount wrapper can only be applied to unsigned integer types. ` +
              `Got type [${nodes.displayNumberTypeNode(number)}].`,
            numberWrapperType,
            this.stack
          );
        }
        break;
      default:
        break;
    }
    this.popNode();
    return bag;
  }

  protected checkExportConflicts(
    node: nodes.Node,
    exports: Record<string, string>
  ): ValidatorBag {
    const bag = new ValidatorBag();
    const stack = this.stack.clone();
    const conflictingNodes: nodes.Node[] = [];
    Object.entries(exports).forEach(([exportName, exportType]) => {
      // Checks for conflicts.
      const exportConflict = this.exportMap.get(exportName);
      if (!exportConflict) {
        this.exportMap.set(exportName, { node, stack, exportType });
        return;
      }

      // Avoids throwing many similar error for the same kind of conflict.
      const conflictingNode = exportConflict.node;
      if (conflictingNodes.includes(conflictingNode)) return;
      conflictingNodes.push(conflictingNode);

      // Constructs the error message.
      let exportDetails = '';
      let conflictExportDetails = '';
      if (!this.isEponymousExport(node, exportName)) {
        exportDetails = `exports a "${exportName}" ${exportType} that `;
      }
      if (!this.isEponymousExport(conflictingNode, exportName)) {
        conflictExportDetails = `"${exportName}" ${exportConflict.exportType} exported by the `;
      }
      const message =
        `The ${this.getNodeTitle(node)} ${exportDetails}` +
        `conflicts with the ${conflictExportDetails}` +
        `${this.getNodeTitle(conflictingNode)}.\n` +
        `|> Conflicting stack: ${exportConflict.stack}.`;
      bag.error(message, node, stack);
    });
    return bag;
  }

  protected isEponymousExport(node: nodes.Node, exportName: string): boolean {
    return exportName === ('name' in node ? node.name : '');
  }

  protected getNodeTitle(node: nodes.Node): string {
    const name = 'name' in node ? node.name : '';
    const type = titleCase(node.kind.slice(0, -4)).toLowerCase();
    return `"${name}" ${type}`;
  }
}
