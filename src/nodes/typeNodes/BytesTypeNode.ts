export type BytesTypeNode = {
  readonly kind: 'bytesTypeNode';
};

export function bytesTypeNode(): BytesTypeNode {
  return { kind: 'bytesTypeNode' };
}
