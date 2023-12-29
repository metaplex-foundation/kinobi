import { Node } from '../Node';

export type PublicKeyValueNode = {
  readonly kind: 'publicKeyValueNode';
  readonly publicKey: string;
};

export function publicKeyValueNode(publicKey: string): PublicKeyValueNode {
  return { kind: 'publicKeyValueNode', publicKey };
}

export function isPublicKeyValueNode(
  node: Node | null
): node is PublicKeyValueNode {
  return !!node && node.kind === 'publicKeyValueNode';
}

export function assertPublicKeyValueNode(
  node: Node | null
): asserts node is PublicKeyValueNode {
  if (!isPublicKeyValueNode(node)) {
    throw new Error(
      `Expected publicKeyValueNode, got ${node?.kind ?? 'null'}.`
    );
  }
}
