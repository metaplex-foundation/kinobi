import { NestedTypeNode } from './NestedTypeNode';
import { NumberTypeNode, numberTypeNode } from './NumberTypeNode';

export interface BooleanTypeNode<
  TSize extends NestedTypeNode<NumberTypeNode> = NestedTypeNode<NumberTypeNode>,
> {
  readonly kind: 'booleanTypeNode';

  // Children.
  readonly size: TSize;
}

export function booleanTypeNode<
  TSize extends NestedTypeNode<NumberTypeNode> = NumberTypeNode<'u8'>,
>(size?: TSize): BooleanTypeNode<TSize> {
  return {
    kind: 'booleanTypeNode',
    size: (size ?? numberTypeNode('u8')) as TSize,
  };
}
