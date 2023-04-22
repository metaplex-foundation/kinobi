import { mainCase } from '../utils';
import type { ImportFrom, Visitable, Visitor } from '../visitors';
import type { Node } from './Node';

export class DefinedLinkTypeNode implements Visitable {
  readonly nodeClass = 'DefinedLinkTypeNode' as const;

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

export function isDefinedLinkTypeNode(
  node: Node | null
): node is DefinedLinkTypeNode {
  return !!node && node.nodeClass === 'DefinedLinkTypeNode';
}

export function assertDefinedLinkTypeNode(
  node: Node | null
): asserts node is DefinedLinkTypeNode {
  if (!isDefinedLinkTypeNode(node)) {
    throw new Error(
      `Expected DefinedLinkTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
