import { NumberTypeNode } from '../typeNodes';

export type PrefixedSizeNode = {
  readonly kind: 'prefixedSizeNode';
  readonly prefix: NumberTypeNode;
};

export function prefixedSizeNode(prefix: NumberTypeNode): PrefixedSizeNode {
  return { kind: 'prefixedSizeNode', prefix };
}
