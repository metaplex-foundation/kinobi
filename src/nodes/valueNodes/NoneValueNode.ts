export interface NoneValueNode {
  readonly kind: 'noneValueNode';
}

export function noneValueNode(): NoneValueNode {
  return { kind: 'noneValueNode' };
}
