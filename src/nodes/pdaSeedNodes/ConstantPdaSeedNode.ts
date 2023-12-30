import { Node } from '../Node';
import { TypeNode } from '../typeNodes';
import { ValueNode } from '../valueNodes';

export type ConstantPdaSeedNode = {
  readonly kind: 'constantPdaSeedNode';
  readonly type: TypeNode;
  readonly value: ValueNode;
};

export function constantPdaSeedNode(
  type: TypeNode,
  value: ValueNode
): ConstantPdaSeedNode {
  return { kind: 'constantPdaSeedNode', type, value };
}

export function isConstantPdaSeedNode(
  node: Node | null
): node is ConstantPdaSeedNode {
  return !!node && node.kind === 'constantPdaSeedNode';
}

export function assertConstantPdaSeedNode(
  node: Node | null
): asserts node is ConstantPdaSeedNode {
  if (!isConstantPdaSeedNode(node)) {
    throw new Error(
      `Expected constantPdaSeedNode, got ${node?.kind ?? 'null'}.`
    );
  }
}
