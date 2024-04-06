import { NumberTypeNode } from './NumberTypeNode';
import { ResolveNestedTypeNode, TypeNode } from './TypeNode';

export type SizePrefixTypeNode = {
  readonly kind: 'sizePrefixTypeNode';

  // Children.
  readonly type: TypeNode;
  readonly prefix: ResolveNestedTypeNode<NumberTypeNode>;
};

export function sizePrefixTypeNode<
  TType extends SizePrefixTypeNode['type'],
  TPrefix extends SizePrefixTypeNode['prefix'],
>(
  type: TType,
  prefix: TPrefix
): SizePrefixTypeNode & { type: TType; prefix: TPrefix } {
  return { kind: 'sizePrefixTypeNode', type, prefix };
}
