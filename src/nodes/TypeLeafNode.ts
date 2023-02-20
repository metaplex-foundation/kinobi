import type { IdlTypeLeaf } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';

export type NumberLeafType =
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

export type LeafType =
  | { kind: 'number'; number: NumberLeafType; endian: 'le' | 'be' }
  | { kind: 'bool'; prefix: NumberLeafType }
  | { kind: 'string'; prefix: NumberLeafType }
  | { kind: 'fixedString'; bytes: number }
  | { kind: 'variableString' }
  | { kind: 'bytes' }
  | { kind: 'publicKey' };

export class TypeLeafNode implements Visitable {
  readonly nodeClass = 'TypeLeafNode' as const;

  readonly leaf: LeafType;

  constructor(leaf: LeafType) {
    this.leaf = leaf;
  }

  static fromIdl(type: IdlTypeLeaf): TypeLeafNode {
    switch (type) {
      case 'bool':
        return new TypeLeafNode({ kind: 'bool', prefix: 'u8' });
      case 'string':
        return new TypeLeafNode({ kind: 'string', prefix: 'u32' });
      case 'publicKey':
        return new TypeLeafNode({ kind: 'publicKey' });
      case 'bytes':
        return new TypeLeafNode({ kind: 'bytes' });
      default:
        return new TypeLeafNode({ kind: 'number', number: type });
    }
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeLeaf(this);
  }

  isSignedInteger(): boolean {
    return this.isNumber() && this.leaf.number.startsWith('i');
  }

  isUnsignedInteger(): boolean {
    return this.isNumber() && this.leaf.number.startsWith('u');
  }

  isInteger(): boolean {
    return this.isNumber() && !this.leaf.number.startsWith('f');
  }

  isDecimal(): boolean {
    return this.isNumber() && this.leaf.number.startsWith('f');
  }

  isNumber(): this is TypeLeafNode & {
    leaf: Extract<LeafType, { kind: 'number' }>;
  } {
    return this.leaf.kind === 'number';
  }

  toString(): string {
    switch (this.leaf.kind) {
      case 'number':
        return `number(${this.leaf.number})`;
      case 'fixedString':
        return `fixedString(${this.leaf.bytes})`;
      case 'string':
        return `string(${this.leaf.prefix})`;
      case 'bool':
        return `bool(${this.leaf.prefix})`;
      default:
        return this.leaf.kind;
    }
  }
}

export function isTypeLeafNode(node: Node | null): node is TypeLeafNode {
  return !!node && node.nodeClass === 'TypeLeafNode';
}

export function assertTypeLeafNode(
  node: Node | null
): asserts node is TypeLeafNode {
  if (!isTypeLeafNode(node)) {
    throw new Error(`Expected TypeLeafNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
