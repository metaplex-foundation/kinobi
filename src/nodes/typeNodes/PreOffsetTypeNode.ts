import { TypeNode } from './TypeNode';

export interface PreOffsetTypeNode<TType extends TypeNode = TypeNode> {
  readonly kind: 'preOffsetTypeNode';

  // Children.
  readonly type: TType;

  // Data.
  readonly offset: number;
  readonly strategy?: 'relative' | 'absolute' | 'padded';
}

export function preOffsetTypeNode<TType extends TypeNode>(
  type: TType,
  offset: number,
  strategy?: PreOffsetTypeNode['strategy']
): PreOffsetTypeNode<TType> {
  return { kind: 'preOffsetTypeNode', type, offset, strategy };
}
