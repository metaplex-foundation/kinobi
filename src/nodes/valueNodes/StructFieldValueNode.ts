import { MainCaseString, mainCase } from '../../shared';
import { ValueNode } from './ValueNode';

export interface StructFieldValueNode {
  readonly kind: 'structFieldValueNode';

  // Children.
  readonly value: ValueNode;

  // Data.
  readonly name: MainCaseString;
}

export function structFieldValueNode(
  name: string,
  value: ValueNode
): StructFieldValueNode {
  return { kind: 'structFieldValueNode', name: mainCase(name), value };
}
