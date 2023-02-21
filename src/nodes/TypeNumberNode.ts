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

export class TypeNumberNode implements Visitable {
  readonly nodeClass = 'TypeNumberNode' as const;

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

export function isTypeNumberNode(node: Node | null): node is TypeNumberNode {
  return !!node && node.nodeClass === 'TypeNumberNode';
}

export function assertTypeNumberNode(
  node: Node | null
): asserts node is TypeNumberNode {
  if (!isTypeNumberNode(node)) {
    throw new Error(
      `Expected TypeNumberNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
