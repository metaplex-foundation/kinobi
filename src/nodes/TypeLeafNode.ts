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

export type LeafWrapper =
  | { __kind: 'DateTime' }
  | { __kind: 'Amount'; identifier: string; decimals: number };

export class TypeLeafNode implements Visitable {
  readonly nodeClass = 'TypeLeafNode' as const;

  constructor(
    readonly type: LeafType,
    readonly wrapper: LeafWrapper | null = null
  ) {}

  static isValidType(type: string): type is LeafType {
    return LEAF_TYPES.includes(type as LeafType);
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeLeaf(this);
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
