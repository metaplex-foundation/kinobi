export interface BooleanValueNode {
  readonly kind: 'booleanValueNode';

  // Data.
  readonly boolean: boolean;
}

export function booleanValueNode(boolean: boolean): BooleanValueNode {
  return { kind: 'booleanValueNode', boolean };
}
