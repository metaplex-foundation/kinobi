export type BooleanValueNode = {
  readonly kind: 'booleanValueNode';
  readonly boolean: boolean;
};

export function booleanValueNode(boolean: boolean): BooleanValueNode {
  return { kind: 'booleanValueNode', boolean };
}
