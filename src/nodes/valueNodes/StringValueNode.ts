export type StringValueNode = {
  readonly kind: 'stringValueNode';

  // Data.
  readonly string: string;
};

export function stringValueNode(string: string): StringValueNode {
  return { kind: 'stringValueNode', string };
}
