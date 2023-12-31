import type { IdlTypeStruct } from '../../idl';
import {
  StructFieldTypeNode,
  structFieldTypeNodeFromIdl,
} from './StructFieldTypeNode';

export type StructTypeNode = {
  readonly kind: 'structTypeNode';
  readonly fields: StructFieldTypeNode[];
};

export function structTypeNode(fields: StructFieldTypeNode[]): StructTypeNode {
  return { kind: 'structTypeNode', fields };
}

export function structTypeNodeFromIdl(idl: IdlTypeStruct): StructTypeNode {
  return structTypeNode((idl.fields ?? []).map(structFieldTypeNodeFromIdl));
}
