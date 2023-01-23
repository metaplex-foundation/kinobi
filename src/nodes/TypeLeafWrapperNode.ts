import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import type { TypeLeafNode } from './TypeLeafNode';

export type LeafWrapper =
  | { kind: 'DateTime' }
  | { kind: 'SolAmount' }
  | { kind: 'Amount'; identifier: string; decimals: number };

export class TypeLeafWrapperNode implements Visitable {
  readonly nodeClass = 'TypeLeafWrapperNode' as const;

  readonly wrapper: LeafWrapper;

  readonly leaf: TypeLeafNode;

  constructor(wrapper: LeafWrapper, leaf: TypeLeafNode) {
    this.wrapper = wrapper;
    this.leaf = leaf;
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeLeafWrapper(this);
  }
}

export function isTypeLeafWrapperNode(
  node: Node | null
): node is TypeLeafWrapperNode {
  return !!node && node.nodeClass === 'TypeLeafWrapperNode';
}

export function assertTypeLeafWrapperNode(
  node: Node | null
): asserts node is TypeLeafWrapperNode {
  if (!isTypeLeafWrapperNode(node)) {
    throw new Error(
      `Expected TypeLeafWrapperNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
