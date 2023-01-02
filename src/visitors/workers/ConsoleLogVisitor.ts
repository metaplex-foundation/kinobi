/* eslint-disable no-console */
import type * as nodes from '../../nodes';
import { BaseVoidVisitor } from '../BaseVoidVisitor';
import { Visitor } from '../Visitor';

export class ConsoleLogVisitor extends BaseVoidVisitor {
  constructor(readonly visitor: Visitor<any>) {
    super();
  }

  visitRoot(root: nodes.RootNode): void {
    console.log(root.accept(this.visitor));
  }

  visitProgram(program: nodes.ProgramNode): void {
    console.log(program.accept(this.visitor));
  }

  visitAccount(account: nodes.AccountNode): void {
    console.log(account.accept(this.visitor));
  }

  visitInstruction(instruction: nodes.InstructionNode): void {
    console.log(instruction.accept(this.visitor));
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): void {
    console.log(definedType.accept(this.visitor));
  }

  visitError(error: nodes.ErrorNode): void {
    console.log(error.accept(this.visitor));
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): void {
    console.log(typeArray.accept(this.visitor));
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.TypeDefinedLinkNode): void {
    console.log(typeDefinedLink.accept(this.visitor));
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): void {
    console.log(typeEnum.accept(this.visitor));
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): void {
    console.log(typeLeaf.accept(this.visitor));
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): void {
    console.log(typeMap.accept(this.visitor));
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): void {
    console.log(typeOption.accept(this.visitor));
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): void {
    console.log(typeSet.accept(this.visitor));
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): void {
    console.log(typeStruct.accept(this.visitor));
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): void {
    console.log(typeTuple.accept(this.visitor));
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): void {
    console.log(typeVec.accept(this.visitor));
  }
}
