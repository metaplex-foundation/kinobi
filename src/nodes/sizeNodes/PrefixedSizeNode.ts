import { Node } from '../Node';
import { NumberTypeNode } from '../typeNodes';

export type PrefixedSizeNode = {
  readonly kind: 'prefixedSizeNode';
  readonly prefix: NumberTypeNode;
};

export function prefixedSizeNode(prefix: NumberTypeNode): PrefixedSizeNode {
  return { kind: 'prefixedSizeNode', prefix };
}

export function isPrefixedSizeNode(
  node: Node | null
): node is PrefixedSizeNode {
  return !!node && node.kind === 'prefixedSizeNode';
}

export function assertPrefixedSizeNode(
  node: Node | null
): asserts node is PrefixedSizeNode {
  if (!isPrefixedSizeNode(node)) {
    throw new Error(`Expected prefixedSizeNode, got ${node?.kind ?? 'null'}.`);
  }
}
