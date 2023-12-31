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
  readonly kind: 'numberTypeNode';
  readonly format: NumberFormat;
  readonly endian: 'le' | 'be';
};

export function numberTypeNode(
  format: NumberFormat,
  endian: 'le' | 'be' = 'le'
): NumberTypeNode {
  return { kind: 'numberTypeNode', format, endian };
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
