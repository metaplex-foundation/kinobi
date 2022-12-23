import type { Idl } from './idl';
import { assertRootNode, Node, RootNode } from './nodes';
import { readJson } from './utils';
import type { Visitable, Visitor } from './visitors';

export class Kinobi implements Visitable {
  public rootNode: RootNode;

  constructor(idls: string | Partial<Idl> | (string | Partial<Idl>)[]) {
    const idlArray = Array.isArray(idls) ? idls : [idls];
    this.rootNode = RootNode.fromIdls(idlArray.map(readJson));
  }

  accept<T>(visitor: Visitor<T>): T {
    return this.rootNode.accept(visitor);
  }

  update(visitor: Visitor<Node>): Kinobi {
    const newRoot = this.rootNode.accept(visitor);
    assertRootNode(newRoot);
    this.rootNode = newRoot;
    return this;
  }
}
