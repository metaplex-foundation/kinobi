import { NestedTypeNode } from './NestedTypeNode';
import { NumberTypeNode } from './NumberTypeNode';

export interface AmountTypeNode<
  TNumber extends
    NestedTypeNode<NumberTypeNode> = NestedTypeNode<NumberTypeNode>,
> {
  readonly kind: 'amountTypeNode';

  // Children.
  readonly number: TNumber;

  // Data.
  readonly decimals: number;
  readonly unit?: string;
}

export function amountTypeNode<TNumber extends NestedTypeNode<NumberTypeNode>>(
  number: TNumber,
  decimals: number,
  unit?: string
): AmountTypeNode<TNumber> {
  return { kind: 'amountTypeNode', number, decimals, unit };
}
