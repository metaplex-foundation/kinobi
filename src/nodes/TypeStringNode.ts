import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { TypeNumberNode } from './TypeNumberNode';

export class TypeStringNode implements Visitable {
  readonly nodeClass = 'TypeStringNode' as const;

  readonly size:
    | { kind: 'fixed'; bytes: number }
    | { kind: 'prefixed'; prefix: TypeNumberNode }
    | { kind: 'remainder' };

  readonly encoding: 'utf8' | 'base16' | 'base58' | 'base64';

  constructor(
    options: {
      size?: TypeStringNode['size'];
      encoding?: TypeStringNode['encoding'];
    } = {}
  ) {
    this.size = options.size ?? {
      kind: 'prefixed',
      prefix: new TypeNumberNode('u32'),
    };
    this.encoding = options.encoding ?? 'utf8';
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeString(this);
  }

  toString(): string {
    let size = '';
    if (this.size.kind === 'fixed') {
      size = `${this.size.bytes}`;
    } else if (this.size.kind === 'prefixed') {
      size = `${this.size.prefix.toString()}`;
    } else {
      size = 'remainder';
    }
    return `string(${this.encoding}; ${size})`;
  }
}

export function isTypeStringNode(node: Node | null): node is TypeStringNode {
  return !!node && node.nodeClass === 'TypeStringNode';
}

export function assertTypeStringNode(
  node: Node | null
): asserts node is TypeStringNode {
  if (!isTypeStringNode(node)) {
    throw new Error(
      `Expected TypeStringNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
