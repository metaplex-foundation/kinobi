import { ValueNode } from './ValueNode';

export interface TupleValueNode {
  readonly kind: 'tupleValueNode';

  // Children.
  readonly items: ValueNode[];
}

export function tupleValueNode(items: ValueNode[]): TupleValueNode {
  return { kind: 'tupleValueNode', items };
}
