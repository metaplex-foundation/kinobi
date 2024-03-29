import { ValueNode } from './ValueNode';

export type MapEntryValueNode = {
  readonly kind: 'mapEntryValueNode';

  // Children.
  readonly key: ValueNode;
  readonly value: ValueNode;
};

export function mapEntryValueNode(
  key: ValueNode,
  value: ValueNode
): MapEntryValueNode {
  return { kind: 'mapEntryValueNode', key, value };
}
