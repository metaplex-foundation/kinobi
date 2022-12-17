/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
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

  visitTypeScalar(): void {}

  visitTypeDefined(): void {}
}
