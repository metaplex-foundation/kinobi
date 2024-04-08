import { NumberTypeNode, ResolveNestedTypeNode } from '../typeNodes';

export interface PrefixedCountNode<
  TPrefix extends
    ResolveNestedTypeNode<NumberTypeNode> = ResolveNestedTypeNode<NumberTypeNode>,
> {
  readonly kind: 'prefixedCountNode';

  // Children.
  readonly prefix: TPrefix;
}

export function prefixedCountNode<
  TPrefix extends ResolveNestedTypeNode<NumberTypeNode>,
>(prefix: TPrefix): PrefixedCountNode<TPrefix> {
  return { kind: 'prefixedCountNode', prefix };
}
