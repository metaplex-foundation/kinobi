import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { NumberTypeNode } from './NumberTypeNode';

export class BytesTypeNode implements Visitable {
  readonly nodeClass = 'BytesTypeNode' as const;

  readonly size:
    | { kind: 'fixed'; bytes: number }
    | { kind: 'prefixed'; prefix: NumberTypeNode }
    | { kind: 'variable' };

  constructor(options: { size?: BytesTypeNode['size'] } = {}) {
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

export function isBytesTypeNode(node: Node | null): node is BytesTypeNode {
  return !!node && node.nodeClass === 'BytesTypeNode';
}

export function assertBytesTypeNode(
  node: Node | null
): asserts node is BytesTypeNode {
  if (!isBytesTypeNode(node)) {
    throw new Error(
      `Expected BytesTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
