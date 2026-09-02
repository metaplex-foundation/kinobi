import { ConstantValueNode } from '../valueNodes';
import { TypeNode } from './TypeNode';

export type ZeroableOptionTypeNode = {
  readonly kind: 'zeroableOptionTypeNode';
  // Children.
  readonly item: TypeNode;
  readonly zeroValue?: ConstantValueNode;
};

export function zeroableOptionTypeNode(
  item: TypeNode,
  zeroValue?: ConstantValueNode
): ZeroableOptionTypeNode {
  return { kind: 'zeroableOptionTypeNode', item, zeroValue };
}
