import type { IdlTypeStruct } from '../../idl';
import {
  StructFieldTypeNode,
  structFieldTypeNodeFromIdl,
} from './StructFieldTypeNode';

export interface StructTypeNode<
  TFields extends StructFieldTypeNode[] = StructFieldTypeNode[],
> {
  readonly kind: 'structTypeNode';

  // Children.
  readonly fields: TFields;
}

export function structTypeNode<
  const TFields extends StructFieldTypeNode[] = StructFieldTypeNode[],
>(fields: TFields): StructTypeNode<TFields> {
  return { kind: 'structTypeNode', fields };
}

export function structTypeNodeFromIdl(idl: IdlTypeStruct): StructTypeNode {
  return structTypeNode((idl.fields ?? []).map(structFieldTypeNodeFromIdl));
}
