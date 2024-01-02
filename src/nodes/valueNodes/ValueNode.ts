import { getNodeKinds } from '../../shared/utils';
import type { ArrayValueNode } from './ArrayValueNode';
import type { BooleanValueNode } from './BooleanValueNode';
import type { EnumValueNode } from './EnumValueNode';
import type { MapValueNode } from './MapValueNode';
import type { NoneValueNode } from './NoneValueNode';
import type { NumberValueNode } from './NumberValueNode';
import type { PublicKeyValueNode } from './PublicKeyValueNode';
import type { SetValueNode } from './SetValueNode';
import type { SomeValueNode } from './SomeValueNode';
import type { StringValueNode } from './StringValueNode';
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
export type StandaloneValueNodeKinds =
  typeof STANDALONE_VALUE_NODE_KINDS[number];
export type StandaloneValueNodes =
  typeof STANDALONE_VALUE_NODES[StandaloneValueNodeKinds];

// Value Node Registration.

export const REGISTERED_VALUE_NODES = {
  ...STANDALONE_VALUE_NODES,
};

export const REGISTERED_VALUE_NODE_KINDS = getNodeKinds(REGISTERED_VALUE_NODES);
export type RegisteredValueNodeKinds =
  typeof REGISTERED_VALUE_NODE_KINDS[number];
export type RegisteredValueNodes =
  typeof REGISTERED_VALUE_NODES[RegisteredValueNodeKinds];

// Value Node Helpers.

export type ValueNode = RegisteredValueNodes;
export const VALUE_NODES = STANDALONE_VALUE_NODE_KINDS;
