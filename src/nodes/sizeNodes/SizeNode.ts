import type { FixedSizeNode } from './FixedSizeNode';
import type { PrefixedSizeNode } from './PrefixedSizeNode';
import type { RemainderSizeNode } from './RemainderSizeNode';

// Node Group Registration.

export const REGISTERED_SIZE_NODES = {
  fixedSizeNode: {} as FixedSizeNode,
  remainderSizeNode: {} as RemainderSizeNode,
  prefixedSizeNode: {} as PrefixedSizeNode,
};

export const REGISTERED_SIZE_NODE_KEYS = Object.keys(
  REGISTERED_SIZE_NODES
) as (keyof typeof REGISTERED_SIZE_NODES)[];

export type RegisteredSizeNodes = typeof REGISTERED_SIZE_NODES;

// Node Group Helpers.

export type SizeNode = RegisteredSizeNodes[keyof RegisteredSizeNodes];

export const SIZE_NODES = REGISTERED_SIZE_NODE_KEYS;
