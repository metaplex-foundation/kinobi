import { ValueNode } from './ValueNode';

export type SetValueNode = {
  readonly kind: 'setValueNode';

  // Children.
  readonly items: ValueNode[];
};

export function setValueNode(items: ValueNode[]): SetValueNode {
  return { kind: 'setValueNode', items };
}
