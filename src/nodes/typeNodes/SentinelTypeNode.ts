import { ConstantValueNode } from '../valueNodes';
import { TypeNode } from './TypeNode';

export interface SentinelTypeNode<
  TType extends TypeNode = TypeNode,
  TSentinel extends ConstantValueNode = ConstantValueNode,
> {
  readonly kind: 'sentinelTypeNode';

  // Children.
  readonly type: TType;
  readonly sentinel: TSentinel;
}

export function sentinelTypeNode<
  TType extends TypeNode,
  TSentinel extends ConstantValueNode,
>(type: TType, sentinel: TSentinel): SentinelTypeNode<TType, TSentinel> {
  return { kind: 'sentinelTypeNode', type, sentinel };
}
