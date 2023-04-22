import { LinkTypeNode } from './LinkTypeNode';
import type { Node } from './Node';
import { StructTypeNode } from './StructTypeNode';

export type AccountDataNode = {
  readonly __accountDataNode: unique symbol;
  readonly nodeClass: 'AccountDataNode';
  readonly structNode: StructTypeNode;
  readonly linkNode: LinkTypeNode | null;
};

export function accountDataNode(
  structNode: StructTypeNode,
  linkNode?: LinkTypeNode | null
): AccountDataNode {
  return {
    nodeClass: 'AccountDataNode',
    structNode,
    linkNode: linkNode ?? null,
  } as AccountDataNode;
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
