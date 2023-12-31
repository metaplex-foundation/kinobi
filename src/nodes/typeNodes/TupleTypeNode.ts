import type { IdlTypeTuple } from '../../idl';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export type TupleTypeNode = {
  readonly kind: 'tupleTypeNode';
  readonly children: TypeNode[];
};

export function tupleTypeNode<TItems extends TypeNode[] = TypeNode[]>(
  children: [...TItems]
): TupleTypeNode & { readonly children: [...TItems] } {
  return { kind: 'tupleTypeNode', children };
}

export function tupleTypeNodeFromIdl(idl: IdlTypeTuple): TupleTypeNode {
  return tupleTypeNode(idl.tuple.map(createTypeNodeFromIdl));
}
