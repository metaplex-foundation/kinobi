import { Node } from '../Node';
import type { PublicKeyValueNode } from './PublicKeyValueNode';
import type { ArrayValueNode } from './ArrayValueNode';
import type { BooleanValueNode } from './BooleanValueNode';
import type { NumberValueNode } from './NumberValueNode';
import type { StringValueNode } from './StringValueNode';
import type { SomeValueNode } from './SomeValueNode';
import type { NoneValueNode } from './NoneValueNode';
import type { EnumValueNode } from './EnumValueNode';
import type { MapValueNode } from './MapValueNode';
import type { SetValueNode } from './SetValueNode';
import type { StructValueNode } from './StructValueNode';
import type { TupleValueNode } from './TupleValueNode';

// Node Group Registration.

export const REGISTERED_VALUE_NODES = {
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

export const REGISTERED_VALUE_NODE_KEYS = Object.keys(
  REGISTERED_VALUE_NODES
) as (keyof typeof REGISTERED_VALUE_NODES)[];

export type RegisteredValueNodes = typeof REGISTERED_VALUE_NODES;

// Node Group Helpers.

export type ValueNode = RegisteredValueNodes[keyof RegisteredValueNodes];

export const VALUE_NODES = REGISTERED_VALUE_NODE_KEYS;

export function isValueNode(node: Node | null): node is ValueNode {
  return !!node && (REGISTERED_VALUE_NODE_KEYS as string[]).includes(node.kind);
}

export function assertValueNode(node: Node | null): asserts node is ValueNode {
  if (!isValueNode(node)) {
    throw new Error(`Expected typeNode, got ${node?.kind ?? 'null'}.`);
  }
}
