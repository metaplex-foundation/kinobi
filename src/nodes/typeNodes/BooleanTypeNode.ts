import { ResolveNestedTypeNode } from './NestedTypeNode';
import { NumberTypeNode, numberTypeNode } from './NumberTypeNode';

export interface BooleanTypeNode<
  TSize extends
    ResolveNestedTypeNode<NumberTypeNode> = ResolveNestedTypeNode<NumberTypeNode>,
> {
  readonly kind: 'booleanTypeNode';

  // Children.
  readonly size: TSize;
}

export function booleanTypeNode<
  TSize extends ResolveNestedTypeNode<NumberTypeNode> = NumberTypeNode<'u8'>,
>(size?: TSize): BooleanTypeNode<TSize> {
  return {
    kind: 'booleanTypeNode',
    size: (size ?? numberTypeNode('u8')) as TSize,
  };
}
