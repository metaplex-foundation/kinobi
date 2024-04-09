import type { ArrayValueNode } from './ArrayValueNode';
import type { BooleanValueNode } from './BooleanValueNode';
import type { BytesValueNode } from './BytesValueNode';
import type { ConstantValueNode } from './ConstantValueNode';
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
export type StandaloneValueNode =
  | ArrayValueNode
  | BytesValueNode
  | BooleanValueNode
  | ConstantValueNode
  | EnumValueNode
  | MapValueNode
  | NoneValueNode
  | NumberValueNode
  | SetValueNode
  | SomeValueNode
  | StructValueNode
  | TupleValueNode
  | PublicKeyValueNode
  | StringValueNode;
export const STANDALONE_VALUE_NODE_KINDS = [
  'arrayValueNode',
  'bytesValueNode',
  'booleanValueNode',
  'constantValueNode',
  'enumValueNode',
  'mapValueNode',
  'noneValueNode',
  'numberValueNode',
  'setValueNode',
  'someValueNode',
  'structValueNode',
  'tupleValueNode',
  'publicKeyValueNode',
  'stringValueNode',
] satisfies readonly StandaloneValueNode['kind'][];
null as unknown as StandaloneValueNode['kind'] satisfies (typeof STANDALONE_VALUE_NODE_KINDS)[number];

// Value Node Registration.
export type RegisteredValueNode =
  | StandaloneValueNode
  | MapEntryValueNode
  | StructFieldValueNode;
export const REGISTERED_VALUE_NODE_KINDS = [
  ...STANDALONE_VALUE_NODE_KINDS,
  'mapEntryValueNode',
  'structFieldValueNode',
] satisfies readonly RegisteredValueNode['kind'][];
null as unknown as RegisteredValueNode['kind'] satisfies (typeof REGISTERED_VALUE_NODE_KINDS)[number];

// Value Node Helpers.
export type ValueNode = StandaloneValueNode;
export const VALUE_NODES = STANDALONE_VALUE_NODE_KINDS;
