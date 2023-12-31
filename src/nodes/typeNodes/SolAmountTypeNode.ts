import { NumberTypeNode } from './NumberTypeNode';

export type SolAmountTypeNode = {
  readonly kind: 'solAmountTypeNode';
  readonly number: NumberTypeNode;
};

export function solAmountTypeNode(number: NumberTypeNode): SolAmountTypeNode {
  return { kind: 'solAmountTypeNode', number };
}
