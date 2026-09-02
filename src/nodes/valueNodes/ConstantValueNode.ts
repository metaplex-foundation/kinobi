import { TypeNode } from '../typeNodes/TypeNode';
import { ValueNode } from './ValueNode';

export type ConstantValueNode = {
  readonly kind: 'constantValueNode';

  // Children.
  readonly type: TypeNode;
  readonly value: ValueNode;
};

export function constantValueNode(
  type: TypeNode,
  value: ValueNode
): ConstantValueNode {
  return { kind: 'constantValueNode', type, value };
}
