import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';

export const LEAF_TYPES = [
  'string',
  'publicKey',
  'bytes',
  'bool',
  'u8',
  'u16',
  'u32',
  'u64',
  'u128',
  'i8',
  'i16',
  'i32',
  'i64',
  'i128',
  'f32',
  'f64',
] as const;

export type LeafType = typeof LEAF_TYPES[number];

export class TypeLeafNode implements Visitable {
  readonly nodeClass = 'TypeLeafNode' as const;

  constructor(readonly type: LeafType) {}

  static isValidType(type: string): type is LeafType {
    return LEAF_TYPES.includes(type as LeafType);
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeLeaf(this);
  }

  isSignedInteger(): boolean {
    return ['i8', 'i16', 'i32', 'i64', 'i128'].includes(this.type);
  }

  isUnsignedInteger(): boolean {
    return ['u8', 'u16', 'u32', 'u64', 'u128'].includes(this.type);
  }

  isInteger(): boolean {
    return this.isSignedInteger() || this.isUnsignedInteger();
  }

  isDecimal(): boolean {
    return ['f32', 'f64'].includes(this.type);
  }

  isNumber(): boolean {
    return this.isInteger() || this.isDecimal();
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
