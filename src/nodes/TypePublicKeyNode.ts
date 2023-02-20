import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';

export class TypePublicKeyNode implements Visitable {
  readonly nodeClass = 'TypePublicKeyNode' as const;

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypePublicKey(this);
  }

  toString(): string {
    return 'publicKey';
  }
}

export function isTypePublicKeyNode(
  node: Node | null
): node is TypePublicKeyNode {
  return !!node && node.nodeClass === 'TypePublicKeyNode';
}

export function assertTypePublicKeyNode(
  node: Node | null
): asserts node is TypePublicKeyNode {
  if (!isTypePublicKeyNode(node)) {
    throw new Error(
      `Expected TypePublicKeyNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
