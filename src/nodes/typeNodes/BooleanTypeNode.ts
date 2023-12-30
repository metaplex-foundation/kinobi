import type { Node } from '../Node';
import {
  NumberTypeNode,
  displayNumberTypeNode,
  numberTypeNode,
} from './NumberTypeNode';

export type BooleanTypeNode = {
  readonly kind: 'booleanTypeNode';
  readonly size: NumberTypeNode;
};

export function booleanTypeNode(size?: NumberTypeNode): BooleanTypeNode {
  return { kind: 'booleanTypeNode', size: size ?? numberTypeNode('u8') };
}

export function displayBooleanTypeNode(node: BooleanTypeNode): string {
  return `bool(${displayNumberTypeNode(node.size)})`;
}

export function isBooleanTypeNode(node: Node | null): node is BooleanTypeNode {
  return !!node && node.kind === 'booleanTypeNode';
}

export function assertBooleanTypeNode(
  node: Node | null
): asserts node is BooleanTypeNode {
  if (!isBooleanTypeNode(node)) {
    throw new Error(`Expected booleanTypeNode, got ${node?.kind ?? 'null'}.`);
  }
}
