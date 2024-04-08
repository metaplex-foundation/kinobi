export interface FixedCountNode {
  readonly kind: 'fixedCountNode';

  // Data.
  readonly value: number;
}

export function fixedCountNode(value: number): FixedCountNode {
  return { kind: 'fixedCountNode', value };
}
