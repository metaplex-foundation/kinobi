import { NumberTypeNode } from './NumberTypeNode';
import { NestedTypeNode } from './NestedTypeNode';

export interface DateTimeTypeNode<
  TNumber extends
    NestedTypeNode<NumberTypeNode> = NestedTypeNode<NumberTypeNode>,
> {
  readonly kind: 'dateTimeTypeNode';

  // Children.
  readonly number: TNumber;
}

export function dateTimeTypeNode<
  TNumber extends
    NestedTypeNode<NumberTypeNode> = NestedTypeNode<NumberTypeNode>,
>(number: TNumber): DateTimeTypeNode<TNumber> {
  return { kind: 'dateTimeTypeNode', number };
}
