import { RootNode } from './nodes';
import type { Visitable, Visitor } from './visitors';

export class Solita implements Visitable {
  readonly rootNode: RootNode;

  constructor(idl: object) {
    this.rootNode = new RootNode(idl);
  }

  visit(visitor: Visitor): void {
    return this.rootNode.visit(visitor);
  }
}
