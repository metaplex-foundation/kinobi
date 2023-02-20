import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { TypeNumberNode } from './TypeNumberNode';

export type NumberWrapper =
  | { kind: 'DateTime' }
  | { kind: 'SolAmount' }
  | { kind: 'Amount'; identifier: string; decimals: number };

export class TypeNumberWrapperNode implements Visitable {
  readonly nodeClass = 'TypeNumberWrapperNode' as const;

  readonly item: TypeNumberNode;

  readonly wrapper: NumberWrapper;

  constructor(item: TypeNumberNode, wrapper: NumberWrapper) {
    this.item = item;
    this.wrapper = wrapper;
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeNumberWrapper(this);
  }
}

export function isTypeNumberWrapperNode(
  node: Node | null
): node is TypeNumberWrapperNode {
  return !!node && node.nodeClass === 'TypeNumberWrapperNode';
}

export function assertTypeNumberWrapperNode(
  node: Node | null
): asserts node is TypeNumberWrapperNode {
  if (!isTypeNumberWrapperNode(node)) {
    throw new Error(
      `Expected TypeNumberWrapperNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
