import type { IdlTypeTuple } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import type { Node } from './Node';

export class TupleTypeNode implements Visitable {
  readonly nodeClass = 'TupleTypeNode' as const;

  readonly items: TypeNode[];

  constructor(items: TypeNode[]) {
    this.items = items;
  }

  static fromIdl(idl: IdlTypeTuple): TupleTypeNode {
    return new TupleTypeNode(idl.tuple.map(createTypeNodeFromIdl));
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeTuple(this);
  }
}

export function isTupleTypeNode(node: Node | null): node is TupleTypeNode {
  return !!node && node.nodeClass === 'TupleTypeNode';
}

export function assertTupleTypeNode(
  node: Node | null
): asserts node is TupleTypeNode {
  if (!isTupleTypeNode(node)) {
    throw new Error(
      `Expected TupleTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
