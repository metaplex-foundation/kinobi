import { ValueNode } from './ValueNode';

export type TupleValueNode = {
  readonly kind: 'tupleValueNode';
  readonly items: ValueNode[];
};

export function tupleValueNode(items: ValueNode[]): TupleValueNode {
  return { kind: 'tupleValueNode', items };
}
