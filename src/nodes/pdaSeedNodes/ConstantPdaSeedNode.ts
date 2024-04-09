import { TypeNode, stringTypeNode } from '../typeNodes';
import { ValueNode, stringValueNode } from '../valueNodes';

export interface ConstantPdaSeedNode<
  TType extends TypeNode = TypeNode,
  TValue extends ValueNode = ValueNode,
> {
  readonly kind: 'constantPdaSeedNode';

  // Children.
  readonly type: TType;
  readonly value: TValue;
}

export function constantPdaSeedNode<
  TType extends TypeNode,
  TValue extends ValueNode,
>(type: TType, value: TValue): ConstantPdaSeedNode<TType, TValue> {
  return { kind: 'constantPdaSeedNode', type, value };
}

export function constantPdaSeedNodeFromString(value: string) {
  return constantPdaSeedNode(stringTypeNode('utf8'), stringValueNode(value));
}
