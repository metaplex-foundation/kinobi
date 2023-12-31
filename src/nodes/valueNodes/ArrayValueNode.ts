import { ValueNode } from './ValueNode';

export type ArrayValueNode = {
  readonly kind: 'arrayValueNode';
  readonly items: ValueNode[];
};

export function arrayValueNode(items: ValueNode[]): ArrayValueNode {
  return { kind: 'arrayValueNode', items };
}
