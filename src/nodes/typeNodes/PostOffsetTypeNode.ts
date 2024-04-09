import { TypeNode } from './TypeNode';

export interface PostOffsetTypeNode<TType extends TypeNode = TypeNode> {
  readonly kind: 'postOffsetTypeNode';

  // Children.
  readonly type: TType;

  // Data.
  readonly offset: number;
  readonly strategy?: 'relative' | 'absolute' | 'padded' | 'preOffset';
}

export function postOffsetTypeNode<TType extends TypeNode>(
  type: TType,
  offset: number,
  strategy?: PostOffsetTypeNode['strategy']
): PostOffsetTypeNode<TType> {
  return { kind: 'postOffsetTypeNode', type, offset, strategy };
}
