import { NumberTypeNode } from './NumberTypeNode';
import { TypeNode } from './TypeNode';

export type SizePrefixTypeNode = {
  readonly kind: 'sizePrefixTypeNode';

  // Children.
  readonly type: TypeNode;
  readonly prefix: NumberTypeNode;
};

export function sizePrefixTypeNode<TType extends TypeNode>(
  type: TType,
  prefix: NumberTypeNode
): SizePrefixTypeNode & { type: TType } {
  return { kind: 'sizePrefixTypeNode', type, prefix };
}
