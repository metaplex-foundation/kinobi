import type { IdlTypeEnumVariant } from '../idl';
import { InvalidKinobiTreeError, mainCase } from '../shared';
import type { Node } from './Node';

export type EnumEmptyVariantTypeNode = {
  readonly __enumEmptyVariantTypeNode: unique symbol;
  readonly nodeClass: 'EnumEmptyVariantTypeNode';
  readonly name: string;
};

export function enumEmptyVariantTypeNode(
  name: string
): EnumEmptyVariantTypeNode {
  if (!name) {
    throw new InvalidKinobiTreeError(
      'EnumEmptyVariantTypeNode must have a name.'
    );
  }
  return {
    nodeClass: 'EnumEmptyVariantTypeNode',
    name: mainCase(name),
  } as EnumEmptyVariantTypeNode;
}

export function enumEmptyVariantTypeNodeFromIdl(
  idl: IdlTypeEnumVariant
): EnumEmptyVariantTypeNode {
  return enumEmptyVariantTypeNode(idl.name ?? '');
}

export function isEnumEmptyVariantTypeNode(
  node: Node | null
): node is EnumEmptyVariantTypeNode {
  return !!node && node.nodeClass === 'EnumEmptyVariantTypeNode';
}

export function assertEnumEmptyVariantTypeNode(
  node: Node | null
): asserts node is EnumEmptyVariantTypeNode {
  if (!isEnumEmptyVariantTypeNode(node)) {
    throw new Error(
      `Expected EnumEmptyVariantTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
