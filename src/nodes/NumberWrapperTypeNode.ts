import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { NumberTypeNode } from './NumberTypeNode';

export type NumberWrapper =
  | { kind: 'DateTime' }
  | { kind: 'SolAmount' }
  | { kind: 'Amount'; identifier: string; decimals: number };

export type NumberWrapperTypeNode = {
  readonly __numberWrapperTypeNode: unique symbol;
  readonly nodeClass: 'NumberWrapperTypeNode';
};

export type NumberWrapperTypeNodeInput = {
  // ...
};

export function numberWrapperTypeNode(
  input: NumberWrapperTypeNodeInput
): NumberWrapperTypeNode {
  return {
    ...input,
    nodeClass: 'NumberWrapperTypeNode',
  } as NumberWrapperTypeNode;
}

export function numberWrapperTypeNodeFromIdl(
  idl: NumberWrapperTypeNodeIdl
): NumberWrapperTypeNode {
  return numberWrapperTypeNode(idl);
}

export class NumberWrapperTypeNode implements Visitable {
  readonly nodeClass = 'NumberWrapperTypeNode' as const;

  readonly item: NumberTypeNode;

  readonly wrapper: NumberWrapper;

  constructor(item: NumberTypeNode, wrapper: NumberWrapper) {
    this.item = item;
    this.wrapper = wrapper;
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeNumberWrapper(this);
  }
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
