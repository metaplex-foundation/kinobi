import { LinkTypeNode } from './LinkTypeNode';
import type { Node } from './Node';
import { StructTypeNode } from './StructTypeNode';

export type AccountDataNode = {
  readonly __accountDataNode: unique symbol;
  readonly kind: 'accountDataNode';
  readonly struct: StructTypeNode;
  readonly link?: LinkTypeNode;
};

export function accountDataNode(
  struct: StructTypeNode,
  link?: LinkTypeNode
): AccountDataNode {
  return { kind: 'accountDataNode', struct, link } as AccountDataNode;
}

export function isAccountDataNode(node: Node | null): node is AccountDataNode {
  return !!node && node.kind === 'accountDataNode';
}

export function assertAccountDataNode(
  node: Node | null
): asserts node is AccountDataNode {
  if (!isAccountDataNode(node)) {
    throw new Error(`Expected AccountDataNode, got ${node?.kind ?? 'null'}.`);
  }
}
