export type ByteDiscriminatorNode = {
  readonly kind: 'byteDiscriminatorNode';

  // Data.
  readonly bytes: number[];
  readonly offset: number;
};

export function byteDiscriminatorNode(
  bytes: number[],
  offset: number = 0
): ByteDiscriminatorNode {
  return { kind: 'byteDiscriminatorNode', bytes, offset };
}
