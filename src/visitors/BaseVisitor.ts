/* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars */
import { AccountNode, RootNode } from 'src/nodes';
import type { Visitor } from './Visitor';

export abstract class BaseVisitor implements Visitor {
  visitRoot(rootNode: RootNode): void {
    rootNode.visitChildren(this);
  }

  visitAccount(account: AccountNode): void {
    //
  }

  visitInstruction(): void {}

  visitTypeLeaf(): void {}

  visitDefinedType(): void {}
}
