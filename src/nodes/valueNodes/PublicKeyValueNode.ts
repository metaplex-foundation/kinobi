export type PublicKeyValueNode = {
  readonly kind: 'publicKeyValueNode';

  // Data.
  readonly publicKey: string;
};

export function publicKeyValueNode(publicKey: string): PublicKeyValueNode {
  return { kind: 'publicKeyValueNode', publicKey };
}
