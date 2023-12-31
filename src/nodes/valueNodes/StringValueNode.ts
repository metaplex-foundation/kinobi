export type StringValueNode = {
  readonly kind: 'stringValueNode';
  readonly string: string;
};

export function stringValueNode(string: string): StringValueNode {
  return { kind: 'stringValueNode', string };
}
