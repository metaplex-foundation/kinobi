import { TypeNode } from './TypeNode';

export interface FixedSizeTypeNode {
  readonly kind: 'fixedSizeTypeNode';

  // Children.
  readonly type: TypeNode;

  // Data.
  readonly size: number;
}

export function fixedSizeTypeNode<TType extends FixedSizeTypeNode['type']>(
  type: TType,
  size: number
): FixedSizeTypeNode & { type: TType } {
  return { kind: 'fixedSizeTypeNode', type, size };
}
