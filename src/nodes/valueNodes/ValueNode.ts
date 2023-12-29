import { Node } from '../Node';
import type { PublicKeyValueNode } from './PublicKeyValueNode';
import type { ArrayValueNode } from './ArrayValueNode';
import type { BooleanValueNode } from './BooleanValueNode';
import type { NumberValueNode } from './NumberValueNode';
import type { StringValueNode } from './StringValueNode';

export const REGISTERED_VALUE_NODES = {
  arrayValueNode: {} as ArrayValueNode,
  booleanValueNode: {} as BooleanValueNode,
  numberValueNode: {} as NumberValueNode,
  publicKeyValueNode: {} as PublicKeyValueNode,
  stringValueNode: {} as StringValueNode,
};

export const REGISTERED_VALUE_NODE_KEYS = Object.keys(
  REGISTERED_VALUE_NODES
) as (keyof typeof REGISTERED_VALUE_NODES)[];

export type RegisteredValueNodes = typeof REGISTERED_VALUE_NODES;

export type ValueNode = RegisteredValueNodes[keyof RegisteredValueNodes];

export function isValueNode(node: Node | null): node is ValueNode {
  return !!node && (REGISTERED_VALUE_NODE_KEYS as string[]).includes(node.kind);
}

export function assertValueNode(node: Node | null): asserts node is ValueNode {
  if (!isValueNode(node)) {
    throw new Error(`Expected typeNode, got ${node?.kind ?? 'null'}.`);
  }
}
