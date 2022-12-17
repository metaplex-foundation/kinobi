import type { Idl } from './idl';
import { RootNode } from './nodes';
import type { Visitable, Visitor } from './visitors';

export class Solita implements Visitable {
  readonly rootNode: RootNode;

  constructor(idl: Partial<Idl>) {
    this.rootNode = RootNode.fromIdl(idl);
  }

  visit(visitor: Visitor): void {
    return this.rootNode.visit(visitor);
  }
}
