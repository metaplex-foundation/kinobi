import { ConstantValueNode } from '../valueNodes';
import { TypeNode } from './TypeNode';

export interface ZeroableOptionTypeNode<
  TItem extends TypeNode = TypeNode,
  TZeroValue extends ConstantValueNode | undefined =
    | ConstantValueNode
    | undefined,
> {
  readonly kind: 'zeroableOptionTypeNode';

  // Children.
  readonly item: TItem;
  readonly zeroValue?: TZeroValue;
}

export function zeroableOptionTypeNode<
  TItem extends TypeNode,
  TZeroValue extends ConstantValueNode | undefined,
>(
  item: TItem,
  zeroValue?: TZeroValue
): ZeroableOptionTypeNode<TItem, TZeroValue> {
  return { kind: 'zeroableOptionTypeNode', item, zeroValue };
}
