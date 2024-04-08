import { StructFieldValueNode } from './StructFieldValueNode';

export interface StructValueNode {
  readonly kind: 'structValueNode';

  // Children.
  readonly fields: StructFieldValueNode[];
}

export function structValueNode(
  fields: StructFieldValueNode[]
): StructValueNode {
  return { kind: 'structValueNode', fields };
}
