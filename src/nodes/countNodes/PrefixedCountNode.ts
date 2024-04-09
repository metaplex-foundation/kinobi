import { NumberTypeNode, NestedTypeNode } from '../typeNodes';

export interface PrefixedCountNode<
  TPrefix extends
    NestedTypeNode<NumberTypeNode> = NestedTypeNode<NumberTypeNode>,
> {
  readonly kind: 'prefixedCountNode';

  // Children.
  readonly prefix: TPrefix;
}

export function prefixedCountNode<
  TPrefix extends NestedTypeNode<NumberTypeNode>,
>(prefix: TPrefix): PrefixedCountNode<TPrefix> {
  return { kind: 'prefixedCountNode', prefix };
}
