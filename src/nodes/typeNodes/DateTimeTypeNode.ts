import type { Node } from '../Node';
import { NumberTypeNode } from './NumberTypeNode';

export type DateTimeTypeNode = {
  readonly kind: 'dateTimeTypeNode';
  readonly number: NumberTypeNode;
};

export function dateTimeTypeNode(number: NumberTypeNode): DateTimeTypeNode {
  return { kind: 'dateTimeTypeNode', number };
}

export function isDateTimeTypeNode(
  node: Node | null
): node is DateTimeTypeNode {
  return !!node && node.kind === 'dateTimeTypeNode';
}

export function assertDateTimeTypeNode(
  node: Node | null
): asserts node is DateTimeTypeNode {
  if (!isDateTimeTypeNode(node)) {
    throw new Error(`Expected dateTimeTypeNode, got ${node?.kind ?? 'null'}.`);
  }
}
