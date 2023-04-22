import {
  SizeStrategy,
  displaySizeStrategy,
  remainderSize,
} from '../shared/SizeStrategy';
import type { Node } from './Node';

export type BytesTypeNode = {
  readonly __bytesTypeNode: unique symbol;
  readonly nodeClass: 'bytesTypeNode';
  readonly size: SizeStrategy;
};

export function bytesTypeNode(size?: SizeStrategy): BytesTypeNode {
  return {
    nodeClass: 'bytesTypeNode',
    size: size ?? remainderSize(),
  } as BytesTypeNode;
}

export function displayBytesTypeNode(node: BytesTypeNode): string {
  return `bytes(${displaySizeStrategy(node.size)})`;
}

export function isBytesTypeNode(node: Node | null): node is BytesTypeNode {
  return !!node && node.nodeClass === 'bytesTypeNode';
}

export function assertBytesTypeNode(
  node: Node | null
): asserts node is BytesTypeNode {
  if (!isBytesTypeNode(node)) {
    throw new Error(
      `Expected BytesTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
