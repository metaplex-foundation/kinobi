import { Node } from '../Node';
import { ValueNode } from '../ValueNode';

export type ArrayValueNode = {
  readonly kind: 'arrayValueNode';
  readonly items: ValueNode[];
};

export function arrayValueNode(items: ValueNode[]): ArrayValueNode {
  return { kind: 'arrayValueNode', items };
}

export function isArrayValueNode(node: Node | null): node is ArrayValueNode {
  return !!node && node.kind === 'arrayValueNode';
}

export function assertArrayValueNode(
  node: Node | null
): asserts node is ArrayValueNode {
  if (!isArrayValueNode(node)) {
    throw new Error(`Expected arrayValueNode, got ${node?.kind ?? 'null'}.`);
  }
}
