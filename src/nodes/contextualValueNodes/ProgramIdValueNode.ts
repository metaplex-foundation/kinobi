export type ProgramIdValueNode = {
  readonly kind: 'programIdValueNode';
};

export function programIdValueNode(): ProgramIdValueNode {
  return { kind: 'programIdValueNode' };
}
