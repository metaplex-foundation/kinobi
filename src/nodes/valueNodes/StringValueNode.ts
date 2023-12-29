import { Node } from '../Node';

export type StringValueNode = {
  readonly kind: 'stringValueNode';
  readonly string: string;
};

export function stringValueNode(string: string): StringValueNode {
  return { kind: 'stringValueNode', string };
}

export function isStringValueNode(node: Node | null): node is StringValueNode {
  return !!node && node.kind === 'stringValueNode';
}

export function assertStringValueNode(
  node: Node | null
): asserts node is StringValueNode {
  if (!isStringValueNode(node)) {
    throw new Error(`Expected stringValueNode, got ${node?.kind ?? 'null'}.`);
  }
}
