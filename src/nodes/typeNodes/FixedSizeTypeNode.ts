import { TypeNode } from './TypeNode';

export type FixedSizeTypeNode = {
  readonly kind: 'fixedSizeTypeNode';

  // Children.
  readonly type: TypeNode;

  // Data.
  readonly size: number;
};

export function fixedSizeTypeNode(
  type: TypeNode,
  size: number
): FixedSizeTypeNode {
  return { kind: 'fixedSizeTypeNode', type, size };
}
