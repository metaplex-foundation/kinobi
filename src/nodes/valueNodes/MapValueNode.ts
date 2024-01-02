import { ValueNode } from './ValueNode';

export type MapValueNode = {
  readonly kind: 'mapValueNode';

  // Children.
  readonly entries: [ValueNode, ValueNode][];
};

export function mapValueNode(entries: [ValueNode, ValueNode][]): MapValueNode {
  return { kind: 'mapValueNode', entries };
}
