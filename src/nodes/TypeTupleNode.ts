import type { Visitable, Visitor } from '../visitors';

export class TypeTupleNode implements Visitable {
  readonly nodeType = 'tuple' as const;

  constructor(readonly todo: string) {}

  visit(visitor: Visitor): void {
    visitor.visitTypeTuple(this);
  }
}
