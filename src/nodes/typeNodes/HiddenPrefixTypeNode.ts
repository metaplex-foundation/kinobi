import { ConstantValueNode } from '../valueNodes';
import { TypeNode } from './TypeNode';

export interface HiddenPrefixTypeNode<
  TType extends TypeNode = TypeNode,
  TPrefix extends ConstantValueNode[] = ConstantValueNode[],
> {
  readonly kind: 'hiddenPrefixTypeNode';

  // Children.
  readonly type: TType;
  readonly prefix: TPrefix;
}

export function hiddenPrefixTypeNode<
  TType extends TypeNode,
  const TPrefix extends ConstantValueNode[],
>(type: TType, prefix: TPrefix): HiddenPrefixTypeNode<TType, TPrefix> {
  return { kind: 'hiddenPrefixTypeNode', type, prefix };
}
