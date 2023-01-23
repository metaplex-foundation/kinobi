import { camelCase, pascalCase, titleCase } from '../../utils';
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
    const exports = {
      [account.name]: 'type',
      [`${account.name}AccountData`]: 'type',
      [`${account.name}AccountArgs`]: 'type',
      [`fetch${account.name}`]: 'function',
      [`safeFetch${account.name}`]: 'function',
      [`deserialize${account.name}`]: 'function',
      [`get${account.name}AccountDataSerializer`]: 'function',
      [`get${account.name}Size`]: 'function',
    };
    if (account.metadata.seeds.length > 0) {
      exports[`find${account.name}Pda`] = 'function';
    }
    bag.mergeWith([this.checkExportConflicts(account, exports)]);
    const reservedAccountFields = new Set(['publicKey', 'header']);
    const invalidFields = account.type.fields
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
    this.popNode();
    return bag;
  }

  visitInstruction(instruction: nodes.InstructionNode): ValidatorBag {
    const bag = super.visitInstruction(instruction);
    this.pushNode(instruction);
    bag.mergeWith([
      this.checkExportConflicts(instruction, {
        [camelCase(instruction.name)]: 'function',
        [`${instruction.name}InstructionAccounts`]: 'type',
        [`${instruction.name}InstructionData`]: 'type',
        [`${instruction.name}InstructionArgs`]: 'type',
        [`get${instruction.name}InstructionDataSerializer`]: 'function',
      }),
    ]);
    this.popNode();
    return bag;
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): ValidatorBag {
    const bag = super.visitDefinedType(definedType);
    this.pushNode(definedType);
    const isDataEnum =
      nodes.isTypeEnumNode(definedType.type) && definedType.type.isDataEnum();
    bag.mergeWith([
      this.checkExportConflicts(definedType, {
        [definedType.name]: 'type',
        [`${definedType.name}Args`]: 'type',
        [`fetch${definedType.name}`]: 'function',
        ...(isDataEnum
          ? {
              [camelCase(definedType.name)]: 'function',
              [`is${definedType.name}`]: 'function',
            }
          : {}),
      }),
    ]);
    this.popNode();
    return bag;
  }

  visitError(error: nodes.ErrorNode): ValidatorBag {
    const bag = super.visitError(error);
    this.pushNode(error);
    const prefixedName =
      pascalCase(this.program?.metadata.prefix ?? '') +
      pascalCase(error.metadata.name);
    bag.mergeWith([
      this.checkExportConflicts(error, {
        [`${prefixedName}Error`]: 'class',
      }),
    ]);
    this.popNode();
    return bag;
  }

  visitTypeLeafWrapper(
    typeLeafWrapper: nodes.TypeLeafWrapperNode
  ): ValidatorBag {
    const bag = super.visitTypeLeafWrapper(typeLeafWrapper);
    this.pushNode(typeLeafWrapper);
    const { wrapper, leaf } = typeLeafWrapper;
    switch (wrapper.kind) {
      case 'DateTime':
        if (!leaf.isInteger()) {
          bag.error(
            `DateTime wrapper can only be applied to ` +
              `integer types. Got type [${leaf.type}].`,
            typeLeafWrapper,
            this.stack
          );
        }
        break;
      case 'Amount':
        if (!leaf.isUnsignedInteger()) {
          bag.error(
            `Amount wrapper can only be applied to ` +
              `unsigned integer types. Got type [${leaf.type}].`,
            typeLeafWrapper,
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
        `${this.getNodeTitle(conflictingNode)}.`;
      bag.error(message, node, stack);
    });
    return bag;
  }

  protected isEponymousExport(node: nodes.Node, exportName: string): boolean {
    return exportName === ('name' in node ? node.name : '');
  }

  protected getNodeTitle(node: nodes.Node): string {
    const name = 'name' in node ? node.name : '';
    const type = titleCase(node.nodeClass.slice(0, -4)).toLowerCase();
    return `"${name}" ${type}`;
  }
}
