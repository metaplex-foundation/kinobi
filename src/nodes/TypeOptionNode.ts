import type { Visitable, Visitor } from '../visitors';

export class TypeOptionNode implements Visitable {
  readonly nodeType = 'option' as const;

  constructor(readonly optionType: 'option' | 'coption') {}

  visit(visitor: Visitor): void {
    visitor.visitTypeOption(this);
  }
}
