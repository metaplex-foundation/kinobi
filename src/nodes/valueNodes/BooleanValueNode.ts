import { Node } from '../Node';

export type BooleanValueNode = {
  readonly kind: 'booleanValueNode';
  readonly boolean: boolean;
};

export function booleanValueNode(boolean: boolean): BooleanValueNode {
  return { kind: 'booleanValueNode', boolean };
}

export function isBooleanValueNode(
  node: Node | null
): node is BooleanValueNode {
  return !!node && node.kind === 'booleanValueNode';
}

export function assertBooleanValueNode(
  node: Node | null
): asserts node is BooleanValueNode {
  if (!isBooleanValueNode(node)) {
    throw new Error(`Expected booleanValueNode, got ${node?.kind ?? 'null'}.`);
  }
}
