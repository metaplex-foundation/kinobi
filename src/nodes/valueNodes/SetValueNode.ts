import { ValueNode } from './ValueNode';

export interface SetValueNode<TItems extends ValueNode[] = ValueNode[]> {
  readonly kind: 'setValueNode';

  // Children.
  readonly items: TItems;
}

export function setValueNode<const TItems extends ValueNode[]>(
  items: TItems
): SetValueNode<TItems> {
  return { kind: 'setValueNode', items };
}
