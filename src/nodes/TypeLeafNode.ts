import type { Visitable, Visitor } from '../visitors';

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
  readonly nodeType = 'leaf' as const;

  constructor(readonly type: LeafType) {}

  static isValidType(type: string): type is LeafType {
    return LEAF_TYPES.includes(type as LeafType);
  }

  visit(visitor: Visitor): void {
    visitor.visitTypeLeaf(this);
  }
}
