import { mainCase } from '../utils';
import type { ImportFrom, Visitable, Visitor } from '../visitors';
import type { Node } from './Node';

export class TypeDefinedLinkNode implements Visitable {
  readonly nodeClass = 'TypeDefinedLinkNode' as const;

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

export function isTypeDefinedLinkNode(
  node: Node | null
): node is TypeDefinedLinkNode {
  return !!node && node.nodeClass === 'TypeDefinedLinkNode';
}

export function assertTypeDefinedLinkNode(
  node: Node | null
): asserts node is TypeDefinedLinkNode {
  if (!isTypeDefinedLinkNode(node)) {
    throw new Error(
      `Expected TypeDefinedLinkNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
