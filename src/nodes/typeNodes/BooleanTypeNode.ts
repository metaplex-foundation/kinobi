import { ResolveNestedTypeNode } from './TypeNode';
import { NumberTypeNode, numberTypeNode } from './NumberTypeNode';

export interface BooleanTypeNode {
  readonly kind: 'booleanTypeNode';

  // Children.
  readonly size: ResolveNestedTypeNode<NumberTypeNode>;
}

export function booleanTypeNode<
  TSize extends BooleanTypeNode['size'] = NumberTypeNode,
>(size?: TSize): BooleanTypeNode & { size: TSize } {
  return {
    kind: 'booleanTypeNode',
    size: (size ?? numberTypeNode('u8')) as TSize,
  };
}
