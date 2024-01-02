import { NumberTypeNode } from './NumberTypeNode';

export type AmountTypeNode = {
  readonly kind: 'amountTypeNode';

  // Children.
  readonly number: NumberTypeNode;

  // Data.
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
