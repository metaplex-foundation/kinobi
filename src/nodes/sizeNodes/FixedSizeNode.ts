import { Node } from '../Node';

export type FixedSizeNode = {
  readonly kind: 'fixedSizeNode';
  readonly size: number;
};

export function fixedSizeNode(size: number): FixedSizeNode {
  return { kind: 'fixedSizeNode', size };
}

export function isFixedSizeNode(node: Node | null): node is FixedSizeNode {
  return !!node && node.kind === 'fixedSizeNode';
}

export function assertFixedSizeNode(
  node: Node | null
): asserts node is FixedSizeNode {
  if (!isFixedSizeNode(node)) {
    throw new Error(`Expected fixedSizeNode, got ${node?.kind ?? 'null'}.`);
  }
}
