import type { IdlTypeStruct } from '../idl';
import { InvalidKinobiTreeError, mainCase } from '../shared';
import type { Node } from './Node';
import {
  StructFieldTypeNode,
  structFieldTypeNodeFromIdl,
} from './StructFieldTypeNode';

export type StructTypeNode = {
  readonly __structTypeNode: unique symbol;
  readonly nodeClass: 'structTypeNode';
  readonly name: string;
  readonly fields: StructFieldTypeNode[];
};

export function structTypeNode(
  name: string,
  fields: StructFieldTypeNode[]
): StructTypeNode {
  if (!name) {
    throw new InvalidKinobiTreeError('StructTypeNode must have a name.');
  }
  return {
    nodeClass: 'structTypeNode',
    name: mainCase(name),
    fields,
  } as StructTypeNode;
}

export function structTypeNodeFromIdl(idl: IdlTypeStruct): StructTypeNode {
  return structTypeNode(
    idl.name ?? '',
    (idl.fields ?? []).map(structFieldTypeNodeFromIdl)
  );
}

export function isStructTypeNode(node: Node | null): node is StructTypeNode {
  return !!node && node.nodeClass === 'structTypeNode';
}

export function assertStructTypeNode(
  node: Node | null
): asserts node is StructTypeNode {
  if (!isStructTypeNode(node)) {
    throw new Error(
      `Expected StructTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
