import { ValueNode } from './ValueNode';

export type SomeValueNode = {
  readonly kind: 'someValueNode';

  // Children.
  readonly value: ValueNode;
};

export function someValueNode(value: ValueNode): SomeValueNode {
  return { kind: 'someValueNode', value };
}
