import type { Idl } from './idl';
import { parseRootNode, RootNode } from './nodes';
import type { Visitable, Visitor } from './visitors';

export class Solita implements Visitable {
  readonly rootNode: RootNode;

  constructor(idl: Partial<Idl>) {
    this.rootNode = parseRootNode(idl);
  }

  visit(visitor: Visitor): void {
    return this.rootNode.visit(visitor);
  }
}
