/* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars */
import {
  AccountNode,
  DefinedTypeNode,
  InstructionNode,
  RootNode,
  TypeLeafNode,
  TypeStructNode,
} from 'src/nodes';
import type { Visitor } from './Visitor';

export abstract class BaseVisitor implements Visitor {
  visitRoot(root: RootNode): void {
    root.visitChildren(this);
  }

  visitAccount(account: AccountNode): void {
    //
  }

  visitInstruction(instruction: InstructionNode): void {
    //
  }

  visitDefinedType(definedType: DefinedTypeNode): void {
    //
  }

  visitTypeLeaf(typeLeaf: TypeLeafNode): void {
    //
  }

  visitTypeStruct(typeStruct: TypeStructNode): void {
    typeStruct.visitChildren(this);
  }
}
