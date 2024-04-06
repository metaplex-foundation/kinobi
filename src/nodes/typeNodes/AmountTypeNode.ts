import { ResolveNestedTypeNode } from './TypeNode';
import { NumberTypeNode } from './NumberTypeNode';

export type AmountTypeNode = {
  readonly kind: 'amountTypeNode';

  // Children.
  readonly number: ResolveNestedTypeNode<NumberTypeNode>;

  // Data.
  readonly decimals: number;
  readonly unit?: string;
};

export function amountTypeNode<TNumber extends AmountTypeNode['number']>(
  number: TNumber,
  decimals: number,
  unit?: string
): AmountTypeNode & { number: TNumber } {
  return { kind: 'amountTypeNode', number, decimals, unit };
}
