import { StructFieldValueNode } from './StructFieldValueNode';

export interface StructValueNode<
  TFields extends StructFieldValueNode[] = StructFieldValueNode[],
> {
  readonly kind: 'structValueNode';

  // Children.
  readonly fields: TFields;
}

export function structValueNode<const TFields extends StructFieldValueNode[]>(
  fields: TFields
): StructValueNode<TFields> {
  return { kind: 'structValueNode', fields };
}
