import { getNodeKinds } from '../../shared/utils';
import type { FixedCountNode } from './FixedCountNode';
import type { PrefixedCountNode } from './PrefixedCountNode';
import type { RemainderCountNode } from './RemainderCountNode';

// Count Node Registration.

export const REGISTERED_COUNT_NODES = {
  fixedCountNode: {} as FixedCountNode,
  remainderCountNode: {} as RemainderCountNode,
  prefixedCountNode: {} as PrefixedCountNode,
};

export const REGISTERED_COUNT_NODE_KINDS = getNodeKinds(REGISTERED_COUNT_NODES);
export type RegisteredCountNodeKind =
  (typeof REGISTERED_COUNT_NODE_KINDS)[number];
export type RegisteredCountNode =
  (typeof REGISTERED_COUNT_NODES)[RegisteredCountNodeKind];

// Count Node Helpers.

export type CountNode = RegisteredCountNode;
export const COUNT_NODES = REGISTERED_COUNT_NODE_KINDS;
