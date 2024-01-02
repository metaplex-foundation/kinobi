import { remainderSizeNode } from '../sizeNodes';
import { TypeNode, stringTypeNode } from '../typeNodes';
import { ValueNode, stringValueNode } from '../valueNodes';

export type ConstantPdaSeedNode = {
  readonly kind: 'constantPdaSeedNode';

  // Children.
  readonly type: TypeNode;
  readonly value: ValueNode;
};

export function constantPdaSeedNode(
  type: TypeNode,
  value: ValueNode
): ConstantPdaSeedNode {
  return { kind: 'constantPdaSeedNode', type, value };
}

export function constantPdaSeedNodeFromString(
  value: string
): ConstantPdaSeedNode {
  return {
    kind: 'constantPdaSeedNode',
    type: stringTypeNode({ size: remainderSizeNode() }),
    value: stringValueNode(value),
  };
}
