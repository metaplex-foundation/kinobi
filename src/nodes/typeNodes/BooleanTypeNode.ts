import { NumberTypeNode, numberTypeNode } from './NumberTypeNode';

export type BooleanTypeNode = {
  readonly kind: 'booleanTypeNode';

  // Children.
  readonly size: NumberTypeNode;
};

export function booleanTypeNode(size?: NumberTypeNode): BooleanTypeNode {
  return { kind: 'booleanTypeNode', size: size ?? numberTypeNode('u8') };
}
