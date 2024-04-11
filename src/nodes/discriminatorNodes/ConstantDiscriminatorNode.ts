import { ConstantValueNode } from '../valueNodes';

export interface ConstantDiscriminatorNode<
  TConstant extends ConstantValueNode = ConstantValueNode,
> {
  readonly kind: 'constantDiscriminatorNode';

  // Children.
  readonly constant: TConstant;

  // Data.
  readonly offset: number;
}

export function constantDiscriminatorNode<TConstant extends ConstantValueNode>(
  constant: TConstant,
  offset: number = 0
): ConstantDiscriminatorNode {
  return { kind: 'constantDiscriminatorNode', constant, offset };
}
