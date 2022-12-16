import type { Visitable, Visitor } from '../visitors';

export class TypeDefinedNode implements Visitable {
  visit(visitor: Visitor): void {
    visitor.visitTypeDefined(this);
  }
}
