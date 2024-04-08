import { ValueNode } from './ValueNode';

export interface SetValueNode {
  readonly kind: 'setValueNode';

  // Children.
  readonly items: ValueNode[];
}

export function setValueNode(items: ValueNode[]): SetValueNode {
  return { kind: 'setValueNode', items };
}
