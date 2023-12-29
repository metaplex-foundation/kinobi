import type { IdlTypeStruct } from '../../idl';
import type { Node } from '../Node';
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

export function isStructTypeNode(node: Node | null): node is StructTypeNode {
  return !!node && node.kind === 'structTypeNode';
}

export function assertStructTypeNode(
  node: Node | null
): asserts node is StructTypeNode {
  if (!isStructTypeNode(node)) {
    throw new Error(`Expected structTypeNode, got ${node?.kind ?? 'null'}.`);
  }
}
