import { NestedTypeNode } from './NestedTypeNode';
import { NumberTypeNode } from './NumberTypeNode';

export interface SolAmountTypeNode<
  TNumber extends
    NestedTypeNode<NumberTypeNode> = NestedTypeNode<NumberTypeNode>,
> {
  readonly kind: 'solAmountTypeNode';

  // Children.
  readonly number: TNumber;
}

export function solAmountTypeNode<
  TNumber extends NestedTypeNode<NumberTypeNode>,
>(number: TNumber): SolAmountTypeNode<TNumber> {
  return { kind: 'solAmountTypeNode', number };
}
