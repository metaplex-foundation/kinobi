import { MainCaseString, mainCase } from '../../shared';
import { Node } from '../Node';
import { ValueNode } from './ValueNode';

export type StructValueNode = {
  readonly kind: 'structValueNode';
  readonly fields: Record<MainCaseString, ValueNode>;
};

export function structValueNode(
  fields: Record<string, ValueNode>
): StructValueNode {
  return {
    kind: 'structValueNode',
    fields: Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [mainCase(key), value])
    ),
  };
}

export function isStructValueNode(node: Node | null): node is StructValueNode {
  return !!node && node.kind === 'structValueNode';
}

export function assertStructValueNode(
  node: Node | null
): asserts node is StructValueNode {
  if (!isStructValueNode(node)) {
    throw new Error(`Expected structValueNode, got ${node?.kind ?? 'null'}.`);
  }
}
