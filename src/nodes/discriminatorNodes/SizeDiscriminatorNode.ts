export interface SizeDiscriminatorNode {
  readonly kind: 'sizeDiscriminatorNode';

  // Data.
  readonly size: number;
}

export function sizeDiscriminatorNode(size: number): SizeDiscriminatorNode {
  return { kind: 'sizeDiscriminatorNode', size };
}
