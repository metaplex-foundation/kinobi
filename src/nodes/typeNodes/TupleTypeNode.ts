import type { IdlTypeTuple } from '../../idl';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export interface TupleTypeNode<TItems extends TypeNode[] = TypeNode[]> {
  readonly kind: 'tupleTypeNode';

  // Children.
  readonly items: TItems;
}

export function tupleTypeNode<const TItems extends TypeNode[] = TypeNode[]>(
  items: TItems
): TupleTypeNode<TItems> {
  return { kind: 'tupleTypeNode', items };
}

export function tupleTypeNodeFromIdl(idl: IdlTypeTuple): TupleTypeNode {
  return tupleTypeNode(idl.tuple.map(createTypeNodeFromIdl));
}
