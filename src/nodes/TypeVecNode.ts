import type { IdlTypeVec } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import type { Node } from './Node';

export class TypeVecNode implements Visitable {
  readonly nodeClass = 'TypeVecNode' as const;

  constructor(readonly itemType: TypeNode) {}

  static fromIdl(idl: IdlTypeVec): TypeVecNode {
    return new TypeVecNode(createTypeNodeFromIdl(idl.vec));
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeVec(this);
  }
}

export function isTypeVecNode(node: Node | null): node is TypeVecNode {
  return !!node && node.nodeClass === 'TypeVecNode';
}

export function assertTypeVecNode(
  node: Node | null
): asserts node is TypeVecNode {
  if (!isTypeVecNode(node)) {
    throw new Error(`Expected TypeVecNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
