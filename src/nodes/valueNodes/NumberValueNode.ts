export type NumberValueNode = {
  readonly kind: 'numberValueNode';

  // Data.
  readonly number: number;
};

export function numberValueNode(number: number): NumberValueNode {
  return { kind: 'numberValueNode', number };
}
