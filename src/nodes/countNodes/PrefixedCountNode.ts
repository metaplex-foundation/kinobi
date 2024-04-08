import { NumberTypeNode, ResolveNestedTypeNode } from '../typeNodes';

export type PrefixedCountNode = {
  readonly kind: 'prefixedCountNode';

  // Children.
  readonly prefix: ResolveNestedTypeNode<NumberTypeNode>;
};

export function prefixedCountNode<
  TPrefix extends ResolveNestedTypeNode<NumberTypeNode>,
>(prefix: TPrefix): PrefixedCountNode & { prefix: TPrefix } {
  return { kind: 'prefixedCountNode', prefix };
}
