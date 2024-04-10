import {
  ProgramIdValueNode,
  programIdValueNode,
} from '../contextualValueNodes';
import {
  StringEncoding,
  TypeNode,
  bytesTypeNode,
  publicKeyTypeNode,
  stringTypeNode,
} from '../typeNodes';
import {
  BytesEncoding,
  ValueNode,
  bytesValueNode,
  stringValueNode,
} from '../valueNodes';

export interface ConstantPdaSeedNode<
  TType extends TypeNode = TypeNode,
  TValue extends ValueNode | ProgramIdValueNode =
    | ValueNode
    | ProgramIdValueNode,
> {
  readonly kind: 'constantPdaSeedNode';

  // Children.
  readonly type: TType;
  readonly value: TValue;
}

export function constantPdaSeedNode<
  TType extends TypeNode,
  TValue extends ValueNode | ProgramIdValueNode,
>(type: TType, value: TValue): ConstantPdaSeedNode<TType, TValue> {
  return { kind: 'constantPdaSeedNode', type, value };
}

export function constantPdaSeedNodeFromProgramId() {
  return constantPdaSeedNode(publicKeyTypeNode(), programIdValueNode());
}

export function constantPdaSeedNodeFromString<TEncoding extends StringEncoding>(
  encoding: TEncoding,
  string: string
) {
  return constantPdaSeedNode(stringTypeNode(encoding), stringValueNode(string));
}

export function constantPdaSeedNodeFromBytes<TEncoding extends BytesEncoding>(
  encoding: TEncoding,
  data: string
) {
  return constantPdaSeedNode(bytesTypeNode(), bytesValueNode(encoding, data));
}
