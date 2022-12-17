import type { IdlTypeVec } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';

export class TypeVecNode implements Visitable {
  readonly nodeType = 'vec' as const;

  constructor(readonly itemType: TypeNode) {}

  static fromIdl(idl: IdlTypeVec): TypeVecNode {
    return new TypeVecNode(createTypeNodeFromIdl(idl.vec));
  }

  visit(visitor: Visitor): void {
    visitor.visitTypeVec(this);
  }

  visitChildren(visitor: Visitor): void {
    this.itemType.visit(visitor);
  }
}
