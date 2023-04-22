import {
  SizeStrategy,
  displaySizeStrategy,
  remainderSize,
} from '../shared/SizeStrategy';
import type { Node } from './Node';

export type BytesTypeNode = {
  readonly __bytesTypeNode: unique symbol;
  readonly nodeClass: 'BytesTypeNode';
  readonly size: SizeStrategy;
};

export type BytesTypeNodeInput = {
  readonly size?: SizeStrategy;
};

export function bytesTypeNode(size?: SizeStrategy): BytesTypeNode {
  return {
    nodeClass: 'BytesTypeNode',
    size: size ?? remainderSize(),
  } as BytesTypeNode;
}

export function displayBytesTypeNode(node: BytesTypeNode): string {
  return `bytes(${displaySizeStrategy(node.size)})`;
}

export function isBytesTypeNode(node: Node | null): node is BytesTypeNode {
  return !!node && node.nodeClass === 'BytesTypeNode';
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
