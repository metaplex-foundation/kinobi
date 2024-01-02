export type FixedSizeNode = {
  readonly kind: 'fixedSizeNode';

  // Data.
  readonly size: number;
};

export function fixedSizeNode(size: number): FixedSizeNode {
  return { kind: 'fixedSizeNode', size };
}
