import { getBase58Encoder } from '@solana/codecs-strings';

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

export function byteDiscriminatorNodeFromBase58(
  base58Bytes: string,
  offset: number = 0
): ByteDiscriminatorNode {
  return byteDiscriminatorNode(
    [...getBase58Encoder().encode(base58Bytes)],
    offset
  );
}
