import { MainCaseString, mainCase } from '../../shared';
import { ValueNode } from './ValueNode';

export interface StructFieldValueNode<TValue extends ValueNode = ValueNode> {
  readonly kind: 'structFieldValueNode';

  // Children.
  readonly value: TValue;

  // Data.
  readonly name: MainCaseString;
}

export function structFieldValueNode<TValue extends ValueNode>(
  name: string,
  value: TValue
): StructFieldValueNode<TValue> {
  return { kind: 'structFieldValueNode', name: mainCase(name), value };
}
