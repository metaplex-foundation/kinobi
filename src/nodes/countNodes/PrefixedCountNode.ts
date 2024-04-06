import { NumberTypeNode } from '../typeNodes';

export type PrefixedCountNode = {
  readonly kind: 'prefixedCountNode';

  // Children.
  readonly prefix: NumberTypeNode;
};

export function prefixedCountNode(prefix: NumberTypeNode): PrefixedCountNode {
  return { kind: 'prefixedCountNode', prefix };
}
