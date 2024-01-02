import { SizeNode, remainderSizeNode } from '../sizeNodes';

export type BytesTypeNode = {
  readonly kind: 'bytesTypeNode';

  // Children.
  readonly size: SizeNode;
};

export function bytesTypeNode(size?: SizeNode): BytesTypeNode {
  return { kind: 'bytesTypeNode', size: size ?? remainderSizeNode() };
}
