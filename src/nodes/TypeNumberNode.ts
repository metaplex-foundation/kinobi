import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';

export type NumberFormat =
  | 'u8'
  | 'u16'
  | 'u32'
  | 'u64'
  | 'u128'
  | 'i8'
  | 'i16'
  | 'i32'
  | 'i64'
  | 'i128'
  | 'f32'
  | 'f64';

export class NumberTypeNode implements Visitable {
  readonly nodeClass = 'NumberTypeNode' as const;

  readonly format: NumberFormat;

  readonly endian: 'le' | 'be';

  constructor(format: NumberFormat, options: { endian?: 'le' | 'be' } = {}) {
    this.format = format;
    this.endian = options.endian ?? 'le';
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeNumber(this);
  }

  isSignedInteger(): boolean {
    return this.format.startsWith('i');
  }

  isUnsignedInteger(): boolean {
    return this.format.startsWith('u');
  }

  isInteger(): boolean {
    return !this.format.startsWith('f');
  }

  isDecimal(): boolean {
    return this.format.startsWith('f');
  }

  toString(): string {
    return `${this.format}(${this.endian})`;
  }
}

export function isNumberTypeNode(node: Node | null): node is NumberTypeNode {
  return !!node && node.nodeClass === 'NumberTypeNode';
}

export function assertNumberTypeNode(
  node: Node | null
): asserts node is NumberTypeNode {
  if (!isNumberTypeNode(node)) {
    throw new Error(
      `Expected NumberTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
