import { TypeNode } from './TypeNode';

export type PreOffsetTypeNode = {
  readonly kind: 'preOffsetTypeNode';
  // Children.
  readonly type: TypeNode;
  // Data.
  readonly offset: number;
  readonly strategy: 'relative' | 'absolute' | 'padded';
};

export function preOffsetTypeNode(
  type: TypeNode,
  offset: number,
  strategy: 'relative' | 'absolute' | 'padded' = 'relative'
): PreOffsetTypeNode {
  return { kind: 'preOffsetTypeNode', type, offset, strategy };
}
