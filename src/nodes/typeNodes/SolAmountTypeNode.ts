import { ResolveNestedTypeNode } from './TypeNode';
import { NumberTypeNode } from './NumberTypeNode';

export interface SolAmountTypeNode<
  TNumber extends
    ResolveNestedTypeNode<NumberTypeNode> = ResolveNestedTypeNode<NumberTypeNode>,
> {
  readonly kind: 'solAmountTypeNode';

  // Children.
  readonly number: TNumber;
}

export function solAmountTypeNode<
  TNumber extends ResolveNestedTypeNode<NumberTypeNode>,
>(number: TNumber): SolAmountTypeNode<TNumber> {
  return { kind: 'solAmountTypeNode', number };
}
