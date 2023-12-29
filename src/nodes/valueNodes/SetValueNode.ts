import { Node } from '../Node';
import { ValueNode } from './ValueNode';

export type SetValueNode = {
  readonly kind: 'setValueNode';
  readonly items: ValueNode[];
};

export function setValueNode(items: ValueNode[]): SetValueNode {
  return { kind: 'setValueNode', items };
}

export function isSetValueNode(node: Node | null): node is SetValueNode {
  return !!node && node.kind === 'setValueNode';
}

export function assertSetValueNode(
  node: Node | null
): asserts node is SetValueNode {
  if (!isSetValueNode(node)) {
    throw new Error(`Expected setValueNode, got ${node?.kind ?? 'null'}.`);
  }
}
