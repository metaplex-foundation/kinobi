import { MainCaseString, mainCase } from '../../shared';
import { ValueNode } from './ValueNode';

export type StructValueNode = {
  readonly kind: 'structValueNode';
  readonly fields: Record<MainCaseString, ValueNode>;
};

export function structValueNode(
  fields: Record<string, ValueNode>
): StructValueNode {
  return {
    kind: 'structValueNode',
    fields: Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [mainCase(key), value])
    ),
  };
}
