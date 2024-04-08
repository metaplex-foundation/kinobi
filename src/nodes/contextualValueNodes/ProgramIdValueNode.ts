export interface ProgramIdValueNode {
  readonly kind: 'programIdValueNode';
}

export function programIdValueNode(): ProgramIdValueNode {
  return { kind: 'programIdValueNode' };
}
