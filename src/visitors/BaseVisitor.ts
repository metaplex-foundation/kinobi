/* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars */
import * as nodes from '../nodes';
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
    definedType.visitChildren(this);
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
    typeMap.visitChildren(this);
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): void {
    typeOption.visitChildren(this);
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): void {
    typeSet.visitChildren(this);
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): void {
    typeStruct.visitChildren(this);
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): void {
    typeTuple.visitChildren(this);
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): void {
    typeVec.visitChildren(this);
  }
}
