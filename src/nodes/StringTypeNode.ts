import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { NumberTypeNode } from './NumberTypeNode';

export class StringTypeNode implements Visitable {
  readonly nodeClass = 'StringTypeNode' as const;

  readonly size:
    | { kind: 'fixed'; bytes: number }
    | { kind: 'prefixed'; prefix: NumberTypeNode }
    | { kind: 'variable' };

  readonly encoding: 'utf8' | 'base16' | 'base58' | 'base64';

  constructor(
    options: {
      size?: StringTypeNode['size'];
      encoding?: StringTypeNode['encoding'];
    } = {}
  ) {
    this.size = options.size ?? {
      kind: 'prefixed',
      prefix: new NumberTypeNode('u32'),
    };
    this.encoding = options.encoding ?? 'utf8';
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeString(this);
  }

  getSizeAsString(): string {
    if (this.size.kind === 'fixed') return `${this.size.bytes}`;
    if (this.size.kind === 'prefixed') return `${this.size.prefix.toString()}`;
    return 'variable';
  }

  toString(): string {
    return `string(${this.encoding};${this.getSizeAsString()})`;
  }
}

export function isStringTypeNode(node: Node | null): node is StringTypeNode {
  return !!node && node.nodeClass === 'StringTypeNode';
}

export function assertStringTypeNode(
  node: Node | null
): asserts node is StringTypeNode {
  if (!isStringTypeNode(node)) {
    throw new Error(
      `Expected StringTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
