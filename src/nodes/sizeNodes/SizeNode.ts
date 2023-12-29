import { Node } from '../Node';
import type { FixedSizeNode } from './FixedSizeNode';
import type { PrefixedSizeNode } from './PrefixedSizeNode';
import type { RemainderSizeNode } from './RemainderSizeNode';

export const REGISTERED_SIZE_NODES = {
  fixedSizeNode: {} as FixedSizeNode,
  remainderSizeNode: {} as RemainderSizeNode,
  prefixedSizeNode: {} as PrefixedSizeNode,
};

export const REGISTERED_SIZE_NODE_KEYS = Object.keys(
  REGISTERED_SIZE_NODES
) as (keyof typeof REGISTERED_SIZE_NODES)[];

export type RegisteredSizeNodes = typeof REGISTERED_SIZE_NODES;

export type SizeNode = RegisteredSizeNodes[keyof RegisteredSizeNodes];

export function isSizeNode(node: Node | null): node is SizeNode {
  return !!node && (REGISTERED_SIZE_NODE_KEYS as string[]).includes(node.kind);
}

export function assertSizeNode(node: Node | null): asserts node is SizeNode {
  if (!isSizeNode(node)) {
    throw new Error(`Expected typeNode, got ${node?.kind ?? 'null'}.`);
  }
}
