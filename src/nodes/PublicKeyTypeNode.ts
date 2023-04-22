import type { Node } from './Node';

export type PublicKeyTypeNode = {
  readonly __publicKeyTypeNode: unique symbol;
  readonly nodeClass: 'publicKeyTypeNode';
};

export function publicKeyTypeNode(): PublicKeyTypeNode {
  return { nodeClass: 'publicKeyTypeNode' } as PublicKeyTypeNode;
}

export function isPublicKeyTypeNode(
  node: Node | null
): node is PublicKeyTypeNode {
  return !!node && node.nodeClass === 'publicKeyTypeNode';
}

export function assertPublicKeyTypeNode(
  node: Node | null
): asserts node is PublicKeyTypeNode {
  if (!isPublicKeyTypeNode(node)) {
    throw new Error(
      `Expected PublicKeyTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
