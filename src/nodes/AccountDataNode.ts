import { LinkTypeNode } from './LinkTypeNode';
import type { Node } from './Node';
import { StructTypeNode } from './StructTypeNode';

export type AccountDataNode = {
  readonly __accountDataNode: unique symbol;
  readonly nodeClass: 'AccountDataNode';
  readonly struct: StructTypeNode;
  readonly link?: LinkTypeNode;
};

export function accountDataNode(
  struct: StructTypeNode,
  link?: LinkTypeNode
): AccountDataNode {
  return { nodeClass: 'AccountDataNode', struct, link } as AccountDataNode;
}

export function isAccountDataNode(node: Node | null): node is AccountDataNode {
  return !!node && node.nodeClass === 'AccountDataNode';
}

export function assertAccountDataNode(
  node: Node | null
): asserts node is AccountDataNode {
  if (!isAccountDataNode(node)) {
    throw new Error(
      `Expected AccountDataNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
