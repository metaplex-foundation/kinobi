import type { Node } from '../Node';
import { SizeNode, remainderSizeNode } from '../sizeNodes';

export type BytesTypeNode = {
  readonly kind: 'bytesTypeNode';
  readonly size: SizeNode;
};

export function bytesTypeNode(size?: SizeNode): BytesTypeNode {
  return { kind: 'bytesTypeNode', size: size ?? remainderSizeNode() };
}

export function isBytesTypeNode(node: Node | null): node is BytesTypeNode {
  return !!node && node.kind === 'bytesTypeNode';
}

export function assertBytesTypeNode(
  node: Node | null
): asserts node is BytesTypeNode {
  if (!isBytesTypeNode(node)) {
    throw new Error(`Expected bytesTypeNode, got ${node?.kind ?? 'null'}.`);
  }
}
