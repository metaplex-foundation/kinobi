import type { Visitable, Visitor } from '../visitors';

export class DefinedTypeNode implements Visitable {
  visit(visitor: Visitor): void {
    visitor.visitDefinedType(this);
  }
}
