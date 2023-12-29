import { Node } from '../Node';

export type NumberValueNode = {
  readonly kind: 'numberValueNode';
  readonly number: number;
};

export function numberValueNode(number: number): NumberValueNode {
  return { kind: 'numberValueNode', number };
}

export function isNumberValueNode(node: Node | null): node is NumberValueNode {
  return !!node && node.kind === 'numberValueNode';
}

export function assertNumberValueNode(
  node: Node | null
): asserts node is NumberValueNode {
  if (!isNumberValueNode(node)) {
    throw new Error(`Expected numberValueNode, got ${node?.kind ?? 'null'}.`);
  }
}
