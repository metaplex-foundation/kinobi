import { NumberTypeNode } from './NumberTypeNode';

export interface SolAmountTypeNode {
  readonly kind: 'solAmountTypeNode';

  // Children.
  readonly number: NumberTypeNode;
}

export function solAmountTypeNode(number: NumberTypeNode): SolAmountTypeNode {
  return { kind: 'solAmountTypeNode', number };
}
