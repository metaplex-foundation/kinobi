import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';

export class TypeBytesNode implements Visitable {
  readonly nodeClass = 'TypeBytesNode' as const;

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeBytes(this);
  }

  toString(): string {
    return 'bytes';
  }
}

export function isTypeBytesNode(node: Node | null): node is TypeBytesNode {
  return !!node && node.nodeClass === 'TypeBytesNode';
}

export function assertTypeBytesNode(
  node: Node | null
): asserts node is TypeBytesNode {
  if (!isTypeBytesNode(node)) {
    throw new Error(
      `Expected TypeBytesNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
