import type { Node } from '../Node';

export type PublicKeyTypeNode = {
  readonly kind: 'publicKeyTypeNode';
};

export function publicKeyTypeNode(): PublicKeyTypeNode {
  return { kind: 'publicKeyTypeNode' };
}

export function isPublicKeyTypeNode(
  node: Node | null
): node is PublicKeyTypeNode {
  return !!node && node.kind === 'publicKeyTypeNode';
}

export function assertPublicKeyTypeNode(
  node: Node | null
): asserts node is PublicKeyTypeNode {
  if (!isPublicKeyTypeNode(node)) {
    throw new Error(`Expected publicKeyTypeNode, got ${node?.kind ?? 'null'}.`);
  }
}
