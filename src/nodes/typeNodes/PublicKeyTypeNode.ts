export interface PublicKeyTypeNode {
  readonly kind: 'publicKeyTypeNode';
}

export function publicKeyTypeNode(): PublicKeyTypeNode {
  return { kind: 'publicKeyTypeNode' };
}
