import { Node } from '../Node';
import { ValueNode } from './ValueNode';

export type TupleValueNode = {
  readonly kind: 'tupleValueNode';
  readonly items: ValueNode[];
};

export function tupleValueNode(items: ValueNode[]): TupleValueNode {
  return { kind: 'tupleValueNode', items };
}

export function isTupleValueNode(node: Node | null): node is TupleValueNode {
  return !!node && node.kind === 'tupleValueNode';
}

export function assertTupleValueNode(
  node: Node | null
): asserts node is TupleValueNode {
  if (!isTupleValueNode(node)) {
    throw new Error(`Expected tupleValueNode, got ${node?.kind ?? 'null'}.`);
  }
}
