import { mainCase } from '../utils';
import type { ImportFrom, Visitable, Visitor } from '../visitors';
import type { Node } from './Node';

export type LinkTypeNode = {
  readonly __linkTypeNode: unique symbol;
  readonly nodeClass: 'LinkTypeNode';
};

export type LinkTypeNodeInput = {
  // ...
};

export function linkTypeNode(input: LinkTypeNodeInput): LinkTypeNode {
  return { ...input, nodeClass: 'LinkTypeNode' } as LinkTypeNode;
}

export function linkTypeNodeFromIdl(idl: LinkTypeNodeIdl): LinkTypeNode {
  return linkTypeNode(idl);
}

export class LinkTypeNode implements Visitable {
  readonly nodeClass = 'LinkTypeNode' as const;

  readonly name: string;

  readonly importFrom: ImportFrom;

  readonly size: number | null;

  constructor(
    name: string,
    options: {
      importFrom?: ImportFrom;
      size?: number | null;
    } = {}
  ) {
    this.name = mainCase(name);
    this.importFrom = options.importFrom ?? 'generated';
    this.size = options.size ?? null;
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeDefinedLink(this);
  }
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
