export type PublicKeyValueNode = {
  readonly kind: 'publicKeyValueNode';
  readonly publicKey: string;
};

export function publicKeyValueNode(publicKey: string): PublicKeyValueNode {
  return { kind: 'publicKeyValueNode', publicKey };
}
