import { TypeNode } from './TypeNode';

export interface RemainderOptionTypeNode<TItem extends TypeNode = TypeNode> {
  readonly kind: 'remainderOptionTypeNode';

  // Children.
  readonly item: TItem;
}

export function remainderOptionTypeNode<TItem extends TypeNode>(
  item: TItem
): RemainderOptionTypeNode<TItem> {
  return { kind: 'remainderOptionTypeNode', item };
}
