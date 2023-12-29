import { Node } from '../Node';
import { ValueNode } from './ValueNode';

export type SomeValueNode = {
  readonly kind: 'someValueNode';
  readonly value: ValueNode;
};

export function someValueNode(value: ValueNode): SomeValueNode {
  return { kind: 'someValueNode', value };
}

export function isSomeValueNode(node: Node | null): node is SomeValueNode {
  return !!node && node.kind === 'someValueNode';
}

export function assertSomeValueNode(
  node: Node | null
): asserts node is SomeValueNode {
  if (!isSomeValueNode(node)) {
    throw new Error(`Expected someValueNode, got ${node?.kind ?? 'null'}.`);
  }
}
