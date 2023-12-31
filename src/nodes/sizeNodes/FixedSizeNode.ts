export type FixedSizeNode = {
  readonly kind: 'fixedSizeNode';
  readonly size: number;
};

export function fixedSizeNode(size: number): FixedSizeNode {
  return { kind: 'fixedSizeNode', size };
}
