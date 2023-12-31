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
