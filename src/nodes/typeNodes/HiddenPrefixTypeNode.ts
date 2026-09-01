import { ConstantValueNode } from '../valueNodes';
import { TypeNode } from './TypeNode';

export type HiddenPrefixTypeNode = {
  readonly kind: 'hiddenPrefixTypeNode';
  // Children.
  readonly type: TypeNode;
  readonly prefix: ConstantValueNode[];
};

export function hiddenPrefixTypeNode(
  type: TypeNode,
  prefix: ConstantValueNode[]
): HiddenPrefixTypeNode {
  return { kind: 'hiddenPrefixTypeNode', type, prefix };
}
