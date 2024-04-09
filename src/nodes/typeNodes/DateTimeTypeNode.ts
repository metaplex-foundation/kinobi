import { NumberTypeNode } from './NumberTypeNode';
import { ResolveNestedTypeNode } from './NestedTypeNode';

export interface DateTimeTypeNode<
  TNumber extends
    ResolveNestedTypeNode<NumberTypeNode> = ResolveNestedTypeNode<NumberTypeNode>,
> {
  readonly kind: 'dateTimeTypeNode';

  // Children.
  readonly number: TNumber;
}

export function dateTimeTypeNode<
  TNumber extends
    ResolveNestedTypeNode<NumberTypeNode> = ResolveNestedTypeNode<NumberTypeNode>,
>(number: TNumber): DateTimeTypeNode<TNumber> {
  return { kind: 'dateTimeTypeNode', number };
}
