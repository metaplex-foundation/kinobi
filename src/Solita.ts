import type { Idl } from './idl';
import { assertRootNode, Node, RootNode } from './nodes';
import type { Visitable, Visitor } from './visitors';

export class Solita implements Visitable {
  public rootNode: RootNode;

  constructor(idl: Partial<Idl>) {
    this.rootNode = RootNode.fromIdl(idl);
  }

  accept<T>(visitor: Visitor<T>): T {
    return this.rootNode.accept(visitor);
  }

  updateRootNode(visitor: Visitor<Node>): Solita {
    const newRoot = this.rootNode.accept(visitor);
    assertRootNode(newRoot);
    this.rootNode = newRoot;
    return this;
  }
}
