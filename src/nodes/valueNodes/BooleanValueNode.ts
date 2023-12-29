import { Node } from '../Node';

export type BooleanValueNode = {
  readonly kind: 'booleanTypeNode';
  readonly boolean: boolean;
};

export function booleanTypeNode(boolean: boolean): BooleanValueNode {
  return { kind: 'booleanTypeNode', boolean };
}

export function isBooleanValueNode(
  node: Node | null
): node is BooleanValueNode {
  return !!node && node.kind === 'booleanTypeNode';
}

export function assertBooleanValueNode(
  node: Node | null
): asserts node is BooleanValueNode {
  if (!isBooleanValueNode(node)) {
    throw new Error(`Expected booleanTypeNode, got ${node?.kind ?? 'null'}.`);
  }
}
