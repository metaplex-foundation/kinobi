import { Node } from '../Node';

export type RemainderSizeNode = {
  readonly kind: 'remainderSizeNode';
};

export function remainderSizeNode(): RemainderSizeNode {
  return { kind: 'remainderSizeNode' };
}

export function isRemainderSizeNode(
  node: Node | null
): node is RemainderSizeNode {
  return !!node && node.kind === 'remainderSizeNode';
}

export function assertRemainderSizeNode(
  node: Node | null
): asserts node is RemainderSizeNode {
  if (!isRemainderSizeNode(node)) {
    throw new Error(`Expected remainderSizeNode, got ${node?.kind ?? 'null'}.`);
  }
}
