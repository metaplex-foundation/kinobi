import type { Node } from './Node';
import type { EnumEmptyVariantTypeNode } from './EnumEmptyVariantTypeNode';
import type { EnumStructVariantTypeNode } from './EnumStructVariantTypeNode';
import type { EnumTupleVariantTypeNode } from './EnumTupleVariantTypeNode';

export type EnumVariantTypeNode =
  | EnumEmptyVariantTypeNode
  | EnumStructVariantTypeNode
  | EnumTupleVariantTypeNode;

export function isEnumVariantTypeNode(
  node: Node | null
): node is EnumVariantTypeNode {
  return (
    !!node &&
    [
      'EnumEmptyVariantTypeNode',
      'EnumStructVariantTypeNode',
      'EnumTupleVariantTypeNode',
    ].includes(node.nodeClass)
  );
}

export function assertEnumVariantTypeNode(
  node: Node | null
): asserts node is EnumVariantTypeNode {
  if (!isEnumVariantTypeNode(node)) {
    throw new Error(
      `Expected EnumVariantTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
