import { NumberTypeNode } from './NumberTypeNode';

export interface DateTimeTypeNode {
  readonly kind: 'dateTimeTypeNode';

  // Children.
  readonly number: NumberTypeNode;
}

export function dateTimeTypeNode(number: NumberTypeNode): DateTimeTypeNode {
  return { kind: 'dateTimeTypeNode', number };
}
