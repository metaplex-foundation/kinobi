import { getNodeKinds } from '../../shared/utils';
import type { FixedSizeNode } from './FixedSizeNode';
import type { PrefixedSizeNode } from './PrefixedSizeNode';
import type { RemainderSizeNode } from './RemainderSizeNode';

// Size Node Registration.

export const REGISTERED_SIZE_NODES = {
  fixedSizeNode: {} as FixedSizeNode,
  remainderSizeNode: {} as RemainderSizeNode,
  prefixedSizeNode: {} as PrefixedSizeNode,
};

export const REGISTERED_SIZE_NODE_KINDS = getNodeKinds(REGISTERED_SIZE_NODES);
export type RegisteredSizeNodeKind = typeof REGISTERED_SIZE_NODE_KINDS[number];
export type RegisteredSizeNodes =
  typeof REGISTERED_SIZE_NODES[RegisteredSizeNodeKind];

// Size Node Helpers.

export type SizeNode = RegisteredSizeNodes;
export const SIZE_NODES = REGISTERED_SIZE_NODE_KINDS;
