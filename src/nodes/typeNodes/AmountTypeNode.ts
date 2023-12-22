import type { Node } from '../Node';
import { NumberTypeNode } from './NumberTypeNode';

export type AmountTypeNode = {
  readonly kind: 'amountTypeNode';
  readonly number: NumberTypeNode;
  readonly identifier: string;
  readonly decimals: number;
};

export function amountTypeNode(
  number: NumberTypeNode,
  identifier: string,
  decimals: number
): AmountTypeNode {
  return { kind: 'amountTypeNode', number, identifier, decimals };
}

export function isAmountTypeNode(node: Node | null): node is AmountTypeNode {
  return !!node && node.kind === 'amountTypeNode';
}

export function assertAmountTypeNode(
  node: Node | null
): asserts node is AmountTypeNode {
  if (!isAmountTypeNode(node)) {
    throw new Error(`Expected amountTypeNode, got ${node?.kind ?? 'null'}.`);
  }
}
