import { NumberTypeNode } from './NumberTypeNode';

export type DateTimeTypeNode = {
  readonly kind: 'dateTimeTypeNode';
  readonly number: NumberTypeNode;
};

export function dateTimeTypeNode(number: NumberTypeNode): DateTimeTypeNode {
  return { kind: 'dateTimeTypeNode', number };
}
