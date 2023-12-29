import { Node } from '../Node';
import { ValueNode } from './ValueNode';

export type MapValueNode = {
  readonly kind: 'mapValueNode';
  readonly map: [ValueNode, ValueNode][];
};

export function mapValueNode(map: [ValueNode, ValueNode][]): MapValueNode {
  return { kind: 'mapValueNode', map };
}

export function isMapValueNode(node: Node | null): node is MapValueNode {
  return !!node && node.kind === 'mapValueNode';
}

export function assertMapValueNode(
  node: Node | null
): asserts node is MapValueNode {
  if (!isMapValueNode(node)) {
    throw new Error(`Expected mapValueNode, got ${node?.kind ?? 'null'}.`);
  }
}
