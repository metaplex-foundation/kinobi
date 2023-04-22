import type { Node } from './Node';
import { NumberTypeNode } from './NumberTypeNode';

export type NumberWrapper =
  | { kind: 'DateTime' }
  | { kind: 'SolAmount' }
  | { kind: 'Amount'; identifier: string; decimals: number };

export type NumberWrapperTypeNode = {
  readonly __numberWrapperTypeNode: unique symbol;
  readonly nodeClass: 'numberWrapperTypeNode';
  readonly number: NumberTypeNode;
  readonly wrapper: NumberWrapper;
};

export function numberWrapperTypeNode(
  number: NumberTypeNode,
  wrapper: NumberWrapper
): NumberWrapperTypeNode {
  return {
    nodeClass: 'numberWrapperTypeNode',
    number,
    wrapper,
  } as NumberWrapperTypeNode;
}

export function isNumberWrapperTypeNode(
  node: Node | null
): node is NumberWrapperTypeNode {
  return !!node && node.nodeClass === 'numberWrapperTypeNode';
}

export function assertNumberWrapperTypeNode(
  node: Node | null
): asserts node is NumberWrapperTypeNode {
  if (!isNumberWrapperTypeNode(node)) {
    throw new Error(
      `Expected NumberWrapperTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
