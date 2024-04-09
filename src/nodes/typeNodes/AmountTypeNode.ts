import { ResolveNestedTypeNode } from './NestedTypeNode';
import { NumberTypeNode } from './NumberTypeNode';

export interface AmountTypeNode<
  TNumber extends
    ResolveNestedTypeNode<NumberTypeNode> = ResolveNestedTypeNode<NumberTypeNode>,
> {
  readonly kind: 'amountTypeNode';

  // Children.
  readonly number: TNumber;

  // Data.
  readonly decimals: number;
  readonly unit?: string;
}

export function amountTypeNode<
  TNumber extends ResolveNestedTypeNode<NumberTypeNode>,
>(number: TNumber, decimals: number, unit?: string): AmountTypeNode<TNumber> {
  return { kind: 'amountTypeNode', number, decimals, unit };
}
