import type { Visitable, Visitor } from '../visitors';

export class TypeVecNode implements Visitable {
  readonly nodeType = 'vec' as const;

  constructor(readonly todo: string) {}

  visit(visitor: Visitor): void {
    visitor.visitTypeVec(this);
  }
}
