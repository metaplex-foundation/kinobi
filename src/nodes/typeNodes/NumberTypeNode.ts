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
  | 'f64'
  | 'shortU16';

export interface NumberTypeNode<TFormat extends NumberFormat = NumberFormat> {
  readonly kind: 'numberTypeNode';

  // Data.
  readonly format: TFormat;
  readonly endian: 'le' | 'be';
}

export function numberTypeNode<TFormat extends NumberFormat = NumberFormat>(
  format: TFormat,
  endian: 'le' | 'be' = 'le'
): NumberTypeNode<TFormat> {
  return { kind: 'numberTypeNode', format, endian };
}

export function isSignedInteger(node: NumberTypeNode): boolean {
  return node.format.startsWith('i');
}

export function isUnsignedInteger(node: NumberTypeNode): boolean {
  return node.format.startsWith('u') || node.format === 'shortU16';
}

export function isInteger(node: NumberTypeNode): boolean {
  return !node.format.startsWith('f');
}

export function isDecimal(node: NumberTypeNode): boolean {
  return node.format.startsWith('f');
}
