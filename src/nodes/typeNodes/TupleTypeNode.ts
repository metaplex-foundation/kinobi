import type { IdlTypeTuple } from '../../idl';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export interface TupleTypeNode {
  readonly kind: 'tupleTypeNode';

  // Children.
  readonly items: TypeNode[];
}

export function tupleTypeNode<TItems extends TypeNode[] = TypeNode[]>(
  items: [...TItems]
): TupleTypeNode & { readonly items: [...TItems] } {
  return { kind: 'tupleTypeNode', items };
}

export function tupleTypeNodeFromIdl(idl: IdlTypeTuple): TupleTypeNode {
  return tupleTypeNode(idl.tuple.map(createTypeNodeFromIdl));
}
