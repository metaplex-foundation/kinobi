import { Node } from '../Node';
import { NumberTypeNode } from '../typeNodes';

export type PrefixedSizeNode = {
  readonly kind: 'prefixedSizeNode';
  readonly prefix: NumberTypeNode;
};

export function prefixedSizeNode(prefix: NumberTypeNode): PrefixedSizeNode {
  return { kind: 'prefixedSizeNode', prefix };
}

export function isRemainderSizeNode(
  node: Node | null
): node is PrefixedSizeNode {
  return !!node && node.kind === 'prefixedSizeNode';
}

export function assertRemainderSizeNode(
  node: Node | null
): asserts node is PrefixedSizeNode {
  if (!isRemainderSizeNode(node)) {
    throw new Error(`Expected prefixedSizeNode, got ${node?.kind ?? 'null'}.`);
  }
}
