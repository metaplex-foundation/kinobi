import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { TypeNumberNode } from './TypeNumberNode';

export class TypeBytesNode implements Visitable {
  readonly nodeClass = 'TypeBytesNode' as const;

  readonly size:
    | { kind: 'fixed'; bytes: number }
    | { kind: 'prefixed'; prefix: TypeNumberNode }
    | { kind: 'variable' };

  constructor(options: { size?: TypeBytesNode['size'] } = {}) {
    this.size = options.size ?? { kind: 'variable' };
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeBytes(this);
  }

  getSizeAsString(): string {
    if (this.size.kind === 'fixed') return `${this.size.bytes}`;
    if (this.size.kind === 'prefixed') return `${this.size.prefix.toString()}`;
    return 'variable';
  }

  toString(): string {
    return `bytes(${this.getSizeAsString()})`;
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
