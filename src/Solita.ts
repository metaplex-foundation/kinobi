import fs from 'fs';
import type { Idl } from './idl';
import { assertRootNode, Node, RootNode } from './nodes';
import type { Visitable, Visitor } from './visitors';

export class Solita implements Visitable {
  public rootNode: RootNode;

  constructor(idl: string | Partial<Idl>) {
    const parsedIdl: Partial<Idl> =
      typeof idl === 'string'
        ? (JSON.parse(fs.readFileSync(idl, 'utf-8')) as Partial<Idl>)
        : idl;
    this.rootNode = RootNode.fromIdl(parsedIdl);
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
