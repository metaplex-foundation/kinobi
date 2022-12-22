import type { Idl } from './idl';
import { assertRootNode, Node, RootNode } from './nodes';
import { readJson } from './utils';
import type { Visitable, Visitor } from './visitors';

export class Solita implements Visitable {
  public rootNode: RootNode;

  constructor(idl: string | Partial<Idl>) {
    this.rootNode = RootNode.fromIdl(readJson(idl));
  }

  accept<T>(visitor: Visitor<T>): T {
    return this.rootNode.accept(visitor);
  }

  update(visitor: Visitor<Node>): Solita {
    const newRoot = this.rootNode.accept(visitor);
    assertRootNode(newRoot);
    this.rootNode = newRoot;
    return this;
  }
}
