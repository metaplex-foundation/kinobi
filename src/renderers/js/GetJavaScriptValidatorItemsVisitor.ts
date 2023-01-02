import chalk from 'chalk';
import * as nodes from '../../nodes';
import { GetDefaultValidatorItemsVisitor, ValidatorItem } from '../../visitors';

export class GetJavaScriptValidatorItemsVisitor extends GetDefaultValidatorItemsVisitor {
  // private exportedNames: Map<string, string[]> = new Map();

  // private definedTypes = new Set<string>();

  visitRoot(root: nodes.RootNode): ValidatorItem[] {
    return super.visitRoot(root);
  }

  visitProgram(program: nodes.ProgramNode): ValidatorItem[] {
    return super.visitProgram(program);
  }

  visitAccount(account: nodes.AccountNode): ValidatorItem[] {
    const items = super.visitAccount(account);
    this.pushNode(account);
    if (account.name === 'Metadata') {
      items.push(
        this.debug(
          account,
          `You cannot use Metadata as an account name. ${chalk.bold(
            'Because I say so!'
          )}`
        )
      );
    }
    this.popNode();
    return items;
  }

  visitInstruction(instruction: nodes.InstructionNode): ValidatorItem[] {
    return super.visitInstruction(instruction);
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): ValidatorItem[] {
    return super.visitDefinedType(definedType);
  }

  visitError(error: nodes.ErrorNode): ValidatorItem[] {
    return super.visitError(error);
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): ValidatorItem[] {
    return super.visitTypeArray(typeArray);
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.TypeDefinedLinkNode
  ): ValidatorItem[] {
    return super.visitTypeDefinedLink(typeDefinedLink);
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): ValidatorItem[] {
    return super.visitTypeEnum(typeEnum);
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): ValidatorItem[] {
    return super.visitTypeLeaf(typeLeaf);
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): ValidatorItem[] {
    return super.visitTypeMap(typeMap);
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): ValidatorItem[] {
    return super.visitTypeOption(typeOption);
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): ValidatorItem[] {
    return super.visitTypeSet(typeSet);
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): ValidatorItem[] {
    return super.visitTypeStruct(typeStruct);
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): ValidatorItem[] {
    return super.visitTypeTuple(typeTuple);
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): ValidatorItem[] {
    return super.visitTypeVec(typeVec);
  }

  // protected checkNameConflict(node: nodes.Node, name: string): ValidatorItem[] {
  //   if (!name) return [];
  //   const conflict = this.nameConflict(node, name);
  //   if (conflict) return [conflict];
  //   this.exportedNames.set(name, [...this.stack]);
  //   return [];
  // }

  // protected nameConflict(node: nodes.Node, name: string): ValidatorItem | null {
  //   if (!this.exportedNames.has(name)) return null;
  //   const conflictingStack = this.exportedNames.get(name) as string[];
  //   const conflictingStackString = conflictingStack.join(' > ');
  //   const message = `Exported name "${name}" conflicts with the following node "${conflictingStackString}"`;
  //   return this.item('error', node, message);
  // }
}
