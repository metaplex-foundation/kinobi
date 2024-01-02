import { getNodeKinds } from '../../shared/utils';
import type { ArrayValueNode } from './ArrayValueNode';
import type { BooleanValueNode } from './BooleanValueNode';
import type { EnumValueNode } from './EnumValueNode';
import type { MapEntryValueNode } from './MapEntryValueNode';
import type { MapValueNode } from './MapValueNode';
import type { NoneValueNode } from './NoneValueNode';
import type { NumberValueNode } from './NumberValueNode';
import type { PublicKeyValueNode } from './PublicKeyValueNode';
import type { SetValueNode } from './SetValueNode';
import type { SomeValueNode } from './SomeValueNode';
import type { StringValueNode } from './StringValueNode';
import type { StructFieldValueNode } from './StructFieldValueNode';
import type { StructValueNode } from './StructValueNode';
import type { TupleValueNode } from './TupleValueNode';

// Standalone Value Node Registration.

export const STANDALONE_VALUE_NODES = {
  arrayValueNode: {} as ArrayValueNode,
  booleanValueNode: {} as BooleanValueNode,
  enumValueNode: {} as EnumValueNode,
  mapValueNode: {} as MapValueNode,
  noneValueNode: {} as NoneValueNode,
  numberValueNode: {} as NumberValueNode,
  setValueNode: {} as SetValueNode,
  someValueNode: {} as SomeValueNode,
  structValueNode: {} as StructValueNode,
  tupleValueNode: {} as TupleValueNode,
  publicKeyValueNode: {} as PublicKeyValueNode,
  stringValueNode: {} as StringValueNode,
};

export const STANDALONE_VALUE_NODE_KINDS = getNodeKinds(STANDALONE_VALUE_NODES);
export type StandaloneValueNodeKind =
  typeof STANDALONE_VALUE_NODE_KINDS[number];
export type StandaloneValueNode =
  typeof STANDALONE_VALUE_NODES[StandaloneValueNodeKind];

// Value Node Registration.

export const REGISTERED_VALUE_NODES = {
  ...STANDALONE_VALUE_NODES,

  // The following are not valid standalone nodes.
  mapEntryValueNode: {} as MapEntryValueNode,
  structFieldValueNode: {} as StructFieldValueNode,
};

export const REGISTERED_VALUE_NODE_KINDS = getNodeKinds(REGISTERED_VALUE_NODES);
export type RegisteredValueNodeKind =
  typeof REGISTERED_VALUE_NODE_KINDS[number];
export type RegisteredValueNode =
  typeof REGISTERED_VALUE_NODES[RegisteredValueNodeKind];

// Value Node Helpers.

export type ValueNode = StandaloneValueNode;
export const VALUE_NODES = STANDALONE_VALUE_NODE_KINDS;
