import type { Node } from './Node';
import {
  NumberTypeNode,
  displayNumberTypeNode,
  numberTypeNode,
} from './NumberTypeNode';

export type BoolTypeNode = {
  readonly __boolTypeNode: unique symbol;
  readonly nodeClass: 'BoolTypeNode';
  readonly size: NumberTypeNode;
};

export function boolTypeNode(size?: NumberTypeNode): BoolTypeNode {
  return {
    nodeClass: 'BoolTypeNode',
    size: size ?? numberTypeNode('u8'),
  } as BoolTypeNode;
}

export function displayBoolTypeNode(node: BoolTypeNode): string {
  return `bool(${displayNumberTypeNode(node.size)})`;
}

export function isBoolTypeNode(node: Node | null): node is BoolTypeNode {
  return !!node && node.nodeClass === 'BoolTypeNode';
}

export function assertBoolTypeNode(
  node: Node | null
): asserts node is BoolTypeNode {
  if (!isBoolTypeNode(node)) {
    throw new Error(`Expected BoolTypeNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
