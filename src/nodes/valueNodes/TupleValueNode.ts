import { ValueNode } from './ValueNode';

export interface TupleValueNode<TItems extends ValueNode[] = ValueNode[]> {
  readonly kind: 'tupleValueNode';

  // Children.
  readonly items: TItems;
}

export function tupleValueNode<const TItems extends ValueNode[]>(
  items: TItems
): TupleValueNode<TItems> {
  return { kind: 'tupleValueNode', items };
}
