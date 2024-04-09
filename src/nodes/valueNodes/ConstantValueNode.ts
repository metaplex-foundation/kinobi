import { bytesTypeNode } from '../typeNodes/BytesTypeNode';
import { StringEncoding, stringTypeNode } from '../typeNodes/StringTypeNode';
import { TypeNode } from '../typeNodes/TypeNode';
import { BytesEncoding, bytesValueNode } from './BytesValueNode';
import { stringValueNode } from './StringValueNode';
import { ValueNode } from './ValueNode';

export interface ConstantValueNode<
  TType extends TypeNode = TypeNode,
  TValue extends ValueNode = ValueNode,
> {
  readonly kind: 'constantValueNode';

  // Children.
  readonly type: TType;
  readonly value: TValue;
}

export function constantValueNode<
  TType extends TypeNode,
  TValue extends ValueNode,
>(type: TType, value: TValue): ConstantValueNode<TType, TValue> {
  return { kind: 'constantValueNode', type, value };
}

export function constantValueNodeFromString(
  encoding: StringEncoding,
  string: string
) {
  return constantValueNode(stringTypeNode(encoding), stringValueNode(string));
}

export function constantValueNodeFromBytes(
  encoding: BytesEncoding,
  data: string
) {
  return constantValueNode(bytesTypeNode(), bytesValueNode(encoding, data));
}
