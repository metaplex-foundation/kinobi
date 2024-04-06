import { NumberTypeNode } from './NumberTypeNode';
import { TypeNode } from './TypeNode';

export type SizePrefixTypeNode = {
  readonly kind: 'sizePrefixTypeNode';

  // Children.
  readonly type: TypeNode;
  readonly prefix: NumberTypeNode;
};

export function sizePrefixTypeNode(
  type: TypeNode,
  prefix: NumberTypeNode
): SizePrefixTypeNode {
  return { kind: 'sizePrefixTypeNode', type, prefix };
}
