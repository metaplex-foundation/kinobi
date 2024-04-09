import type { FixedCountNode } from './FixedCountNode';
import type { PrefixedCountNode } from './PrefixedCountNode';
import type { RemainderCountNode } from './RemainderCountNode';

// Count Node Registration.
export type RegisteredCountNode =
  | FixedCountNode
  | RemainderCountNode
  | PrefixedCountNode;
export const REGISTERED_COUNT_NODE_KINDS = [
  'fixedCountNode',
  'remainderCountNode',
  'prefixedCountNode',
] satisfies readonly RegisteredCountNode['kind'][];
null as unknown as RegisteredCountNode['kind'] satisfies (typeof REGISTERED_COUNT_NODE_KINDS)[number];

// Count Node Helpers.
export type CountNode = RegisteredCountNode;
export const COUNT_NODES = REGISTERED_COUNT_NODE_KINDS;
