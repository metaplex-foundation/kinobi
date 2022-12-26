import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';

export class TypeDefinedLinkNode implements Visitable {
  readonly nodeClass = 'TypeDefinedLinkNode' as const;

  constructor(readonly definedType: string) {}

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeDefinedLink(this);
  }
}

export function isTypeDefinedLinkNode(node: Node): node is TypeDefinedLinkNode {
  return node.nodeClass === 'TypeDefinedLinkNode';
}

export function assertTypeDefinedLinkNode(
  node: Node
): asserts node is TypeDefinedLinkNode {
  if (!isTypeDefinedLinkNode(node)) {
    throw new Error(`Expected TypeDefinedLinkNode, got ${node.nodeClass}.`);
  }
}
