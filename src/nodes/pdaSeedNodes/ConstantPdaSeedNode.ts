import { TypeNode, stringTypeNode } from '../typeNodes';
import { ValueNode, stringValueNode } from '../valueNodes';

export type ConstantPdaSeedNode = {
  readonly kind: 'constantPdaSeedNode';

  // Children.
  readonly type: TypeNode;
  readonly value: ValueNode;
};

export function constantPdaSeedNode<
  TType extends TypeNode,
  TValue extends ValueNode,
>(
  type: TType,
  value: TValue
): ConstantPdaSeedNode & { type: TType; value: TValue } {
  return { kind: 'constantPdaSeedNode', type, value };
}

export function constantPdaSeedNodeFromString(
  value: string
): ConstantPdaSeedNode {
  return {
    kind: 'constantPdaSeedNode',
    type: stringTypeNode(),
    value: stringValueNode(value),
  };
}
