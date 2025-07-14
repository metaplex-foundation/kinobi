export type BigIntValueNode = {
  readonly kind: 'bigIntValueNode';

  // Data.
  readonly value: bigint;
};

export function bigIntValueNode(value: bigint): BigIntValueNode {
  return { kind: 'bigIntValueNode', value };
}
