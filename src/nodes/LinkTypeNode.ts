import type { ImportFrom } from '../shared';
import type { Node } from './Node';

export type LinkTypeNode = {
  readonly __linkTypeNode: unique symbol;
  readonly nodeClass: 'LinkTypeNode';
  readonly name: string;
  readonly importFrom: ImportFrom;
  readonly size: number | null;
};

export function linkTypeNode(
  name: string,
  options: {
    readonly importFrom?: ImportFrom;
    readonly size?: number | null;
  } = {}
): LinkTypeNode {
  return {
    nodeClass: 'LinkTypeNode',
    name,
    importFrom: options.importFrom ?? 'generated',
    size: options.size ?? null,
  } as LinkTypeNode;
}

export function isLinkTypeNode(node: Node | null): node is LinkTypeNode {
  return !!node && node.nodeClass === 'LinkTypeNode';
}

export function assertLinkTypeNode(
  node: Node | null
): asserts node is LinkTypeNode {
  if (!isLinkTypeNode(node)) {
    throw new Error(`Expected LinkTypeNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
