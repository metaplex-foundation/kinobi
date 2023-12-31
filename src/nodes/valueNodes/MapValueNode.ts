import { ValueNode } from './ValueNode';

export type MapValueNode = {
  readonly kind: 'mapValueNode';
  readonly entries: [ValueNode, ValueNode][];
};

export function mapValueNode(entries: [ValueNode, ValueNode][]): MapValueNode {
  return { kind: 'mapValueNode', entries };
}
