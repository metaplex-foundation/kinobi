import { TypeNode } from './TypeNode';

export interface FixedSizeTypeNode<TType extends TypeNode = TypeNode> {
  readonly kind: 'fixedSizeTypeNode';

  // Children.
  readonly type: TType;

  // Data.
  readonly size: number;
}

export function fixedSizeTypeNode<TType extends TypeNode>(
  type: TType,
  size: number
): FixedSizeTypeNode<TType> {
  return { kind: 'fixedSizeTypeNode', type, size };
}
