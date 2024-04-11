import { ConstantValueNode } from '../valueNodes';
import { TypeNode } from './TypeNode';

export interface HiddenSuffixTypeNode<
  TType extends TypeNode = TypeNode,
  TSuffix extends ConstantValueNode[] = ConstantValueNode[],
> {
  readonly kind: 'hiddenSuffixTypeNode';

  // Children.
  readonly type: TType;
  readonly suffix: TSuffix;
}

export function hiddenSuffixTypeNode<
  TType extends TypeNode,
  const TSuffix extends ConstantValueNode[],
>(type: TType, suffix: TSuffix): HiddenSuffixTypeNode<TType, TSuffix> {
  return { kind: 'hiddenSuffixTypeNode', type, suffix };
}
