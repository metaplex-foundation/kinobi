import type { IdlTypeTuple } from '../idl';
import type { Node } from './Node';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export type TupleTypeNode = {
  readonly __tupleTypeNode: unique symbol;
  readonly nodeClass: 'TupleTypeNode';
  readonly childrenNodes: TypeNode[];
};

export function tupleTypeNode(childrenNodes: TypeNode[]): TupleTypeNode {
  return { nodeClass: 'TupleTypeNode', childrenNodes } as TupleTypeNode;
}

export function tupleTypeNodeFromIdl(idl: IdlTypeTuple): TupleTypeNode {
  return tupleTypeNode(idl.tuple.map(createTypeNodeFromIdl));
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
