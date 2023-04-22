import type { Node } from './Node';
import { NumberTypeNode } from './NumberTypeNode';

export type NumberWrapper =
  | { kind: 'DateTime' }
  | { kind: 'SolAmount' }
  | { kind: 'Amount'; identifier: string; decimals: number };

export type NumberWrapperTypeNode = {
  readonly __numberWrapperTypeNode: unique symbol;
  readonly nodeClass: 'NumberWrapperTypeNode';
  readonly numberNode: NumberTypeNode;
  readonly wrapper: NumberWrapper;
};

export function numberWrapperTypeNode(
  numberNode: NumberTypeNode,
  wrapper: NumberWrapper
): NumberWrapperTypeNode {
  return {
    nodeClass: 'NumberWrapperTypeNode',
    numberNode,
    wrapper,
  } as NumberWrapperTypeNode;
}

export function isNumberWrapperTypeNode(
  node: Node | null
): node is NumberWrapperTypeNode {
  return !!node && node.nodeClass === 'NumberWrapperTypeNode';
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
