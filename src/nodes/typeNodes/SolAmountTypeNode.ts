import type { Node } from '../Node';
import { NumberTypeNode } from './NumberTypeNode';

export type SolAmountTypeNode = {
  readonly kind: 'solAmountTypeNode';
  readonly number: NumberTypeNode;
};

export function solAmountTypeNode(number: NumberTypeNode): SolAmountTypeNode {
  return { kind: 'solAmountTypeNode', number };
}

export function isSolAmountTypeNode(
  node: Node | null
): node is SolAmountTypeNode {
  return !!node && node.kind === 'solAmountTypeNode';
}

export function assertSolAmountTypeNode(
  node: Node | null
): asserts node is SolAmountTypeNode {
  if (!isSolAmountTypeNode(node)) {
    throw new Error(`Expected solAmountTypeNode, got ${node?.kind ?? 'null'}.`);
  }
}
