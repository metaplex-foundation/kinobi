import type { IdlTypeTuple } from '../../idl';
import type { Node } from '../Node';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export type TupleTypeNode = {
  readonly __tupleTypeNode: unique symbol;
  readonly kind: 'tupleTypeNode';
  readonly children: TypeNode[];
};

export function tupleTypeNode<TItems extends TypeNode[] = TypeNode[]>(
  children: [...TItems]
): TupleTypeNode & { readonly children: [...TItems] } {
  return { kind: 'tupleTypeNode', children } as TupleTypeNode & {
    readonly children: [...TItems];
  };
}

export function tupleTypeNodeFromIdl(idl: IdlTypeTuple): TupleTypeNode {
  return tupleTypeNode(idl.tuple.map(createTypeNodeFromIdl));
}

export function isTupleTypeNode(node: Node | null): node is TupleTypeNode {
  return !!node && node.kind === 'tupleTypeNode';
}

export function assertTupleTypeNode(
  node: Node | null
): asserts node is TupleTypeNode {
  if (!isTupleTypeNode(node)) {
    throw new Error(`Expected tupleTypeNode, got ${node?.kind ?? 'null'}.`);
  }
}
