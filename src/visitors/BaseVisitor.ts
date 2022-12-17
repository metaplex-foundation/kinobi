/* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars */
import * as nodes from 'src/nodes';
import type { Visitor } from './Visitor';

export abstract class BaseVisitor implements Visitor {
  visitRoot(root: nodes.RootNode): void {
    root.visitChildren(this);
  }

  visitAccount(account: nodes.AccountNode): void {
    //
  }

  visitInstruction(instruction: nodes.InstructionNode): void {
    //
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): void {
    //
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): void {
    typeArray.visitChildren(this);
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.TypeDefinedLinkNode): void {
    //
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): void {
    typeEnum.visitChildren(this);
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): void {
    //
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): void {
    //
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): void {
    //
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): void {
    //
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): void {
    typeStruct.visitChildren(this);
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): void {
    //
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): void {
    //
  }
}
