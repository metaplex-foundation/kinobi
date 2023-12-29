import type { Node } from '../Node';

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

export type NumberTypeNode = {
  readonly __numberTypeNode: unique symbol;
  readonly kind: 'numberTypeNode';
  readonly format: NumberFormat;
  readonly endian: 'le' | 'be';
};

export function numberTypeNode(
  format: NumberFormat,
  endian: 'le' | 'be' = 'le'
): NumberTypeNode {
  return { kind: 'numberTypeNode', format, endian } as NumberTypeNode;
}

export function isSignedInteger(node: NumberTypeNode): boolean {
  return node.format.startsWith('i');
}

export function isUnsignedInteger(node: NumberTypeNode): boolean {
  return node.format.startsWith('u');
}

export function isInteger(node: NumberTypeNode): boolean {
  return !node.format.startsWith('f');
}

export function isDecimal(node: NumberTypeNode): boolean {
  return node.format.startsWith('f');
}

export function displayNumberTypeNode(node: NumberTypeNode): string {
  return `${node.format}(${node.endian})`;
}

export function isNumberTypeNode(node: Node | null): node is NumberTypeNode {
  return !!node && node.kind === 'numberTypeNode';
}

export function assertNumberTypeNode(
  node: Node | null
): asserts node is NumberTypeNode {
  if (!isNumberTypeNode(node)) {
    throw new Error(`Expected numberTypeNode, got ${node?.kind ?? 'null'}.`);
  }
}
