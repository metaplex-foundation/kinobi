import { TypeNode } from './TypeNode';

export type RemainderOptionTypeNode = {
  readonly kind: 'remainderOptionTypeNode';
  // Children.
  readonly item: TypeNode;
};

export function remainderOptionTypeNode(
  item: TypeNode
): RemainderOptionTypeNode {
  return { kind: 'remainderOptionTypeNode', item };
}
