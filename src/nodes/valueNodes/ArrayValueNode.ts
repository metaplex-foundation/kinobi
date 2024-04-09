import { ValueNode } from './ValueNode';

export interface ArrayValueNode<TItems extends ValueNode[] = ValueNode[]> {
  readonly kind: 'arrayValueNode';

  // Children.
  readonly items: TItems;
}

export function arrayValueNode<const TItems extends ValueNode[]>(
  items: TItems
): ArrayValueNode<TItems> {
  return { kind: 'arrayValueNode', items };
}
