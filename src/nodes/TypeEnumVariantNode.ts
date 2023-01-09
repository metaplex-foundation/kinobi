import type { Node } from './Node';
import type { TypeEnumEmptyVariantNode } from './TypeEnumEmptyVariantNode';
import type { TypeEnumStructVariantNode } from './TypeEnumStructVariantNode';
import type { TypeEnumTupleVariantNode } from './TypeEnumTupleVariantNode';

export type TypeEnumVariantNode =
  | TypeEnumEmptyVariantNode
  | TypeEnumStructVariantNode
  | TypeEnumTupleVariantNode;

export function isTypeEnumVariantNode(
  node: Node | null
): node is TypeEnumVariantNode {
  return (
    !!node &&
    [
      'TypeEnumEmptyVariantNode',
      'TypeEnumStructVariantNode',
      'TypeEnumTupleVariantNode',
    ].includes(node.nodeClass)
  );
}

export function assertTypeEnumVariantNode(
  node: Node | null
): asserts node is TypeEnumVariantNode {
  if (!isTypeEnumVariantNode(node)) {
    throw new Error(
      `Expected TypeEnumVariantNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
