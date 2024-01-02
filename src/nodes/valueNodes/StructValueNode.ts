import { StructFieldValueNode } from './StructFieldValueNode';

export type StructValueNode = {
  readonly kind: 'structValueNode';

  // Children.
  readonly fields: StructFieldValueNode[];
};

export function structValueNode(
  fields: StructFieldValueNode[]
): StructValueNode {
  return { kind: 'structValueNode', fields };
}
