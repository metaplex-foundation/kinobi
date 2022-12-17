import type { Visitable, Visitor } from '../visitors';

export class TypeArrayNode implements Visitable {
  readonly nodeType = 'array' as const;

  constructor(readonly todo: string) {}

  visit(visitor: Visitor): void {
    visitor.visitTypeArray(this);
  }
}
