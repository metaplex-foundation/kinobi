import { NumberTypeNode } from './NumberTypeNode';

export type AmountTypeNode = {
  readonly kind: 'amountTypeNode';
  readonly number: NumberTypeNode;
  readonly decimals: number;
  readonly unit?: string;
};

export function amountTypeNode(
  number: NumberTypeNode,
  decimals: number,
  unit?: string
): AmountTypeNode {
  return { kind: 'amountTypeNode', number, decimals, unit };
}
