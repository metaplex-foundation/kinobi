import type { IdlTypeTuple } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import type { Node } from './Node';

export class TypeTupleNode implements Visitable {
  readonly nodeClass = 'TypeTupleNode' as const;

  readonly itemTypes: TypeNode[];

  constructor(itemTypes: TypeNode[]) {
    this.itemTypes = itemTypes;
  }

  static fromIdl(idl: IdlTypeTuple): TypeTupleNode {
    return new TypeTupleNode(idl.tuple.map(createTypeNodeFromIdl));
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeTuple(this);
  }
}

export function isTypeTupleNode(node: Node | null): node is TypeTupleNode {
  return !!node && node.nodeClass === 'TypeTupleNode';
}

export function assertTypeTupleNode(
  node: Node | null
): asserts node is TypeTupleNode {
  if (!isTypeTupleNode(node)) {
    throw new Error(
      `Expected TypeTupleNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
