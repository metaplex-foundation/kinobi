import { Node } from '../Node';

export type NoneValueNode = {
  readonly kind: 'noneValueNode';
};

export function noneValueNode(): NoneValueNode {
  return { kind: 'noneValueNode' };
}

export function isNoneValueNode(node: Node | null): node is NoneValueNode {
  return !!node && node.kind === 'noneValueNode';
}

export function assertNoneValueNode(
  node: Node | null
): asserts node is NoneValueNode {
  if (!isNoneValueNode(node)) {
    throw new Error(`Expected noneValueNode, got ${node?.kind ?? 'null'}.`);
  }
}
