import { getBase58Encoder } from '@solana/codecs-strings';

export interface ConstantDiscriminatorNode {
  readonly kind: 'constantDiscriminatorNode';

  // Data.
  readonly bytes: number[];
  readonly offset: number;
}

export function constantDiscriminatorNode(
  bytes: number[],
  offset: number = 0
): ConstantDiscriminatorNode {
  return { kind: 'constantDiscriminatorNode', bytes, offset };
}

export function constantDiscriminatorNodeFromBase58(
  base58Bytes: string,
  offset: number = 0
): ConstantDiscriminatorNode {
  return constantDiscriminatorNode(
    [...getBase58Encoder().encode(base58Bytes)],
    offset
  );
}
