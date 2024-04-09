import { ValueNode } from './ValueNode';

export interface SomeValueNode<TValue extends ValueNode = ValueNode> {
  readonly kind: 'someValueNode';

  // Children.
  readonly value: TValue;
}

export function someValueNode<TValue extends ValueNode>(
  value: TValue
): SomeValueNode<TValue> {
  return { kind: 'someValueNode', value };
}
