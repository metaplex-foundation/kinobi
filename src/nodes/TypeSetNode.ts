import type { Visitable, Visitor } from '../visitors';

export class TypeSetNode implements Visitable {
  readonly nodeType = 'set' as const;

  constructor(readonly setType: 'todo') {}

  visit(visitor: Visitor): void {
    visitor.visitTypeSet(this);
  }
}
