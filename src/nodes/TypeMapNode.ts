import type { Visitable, Visitor } from '../visitors';

export class TypeMapNode implements Visitable {
  readonly nodeType = 'map' as const;

  constructor(readonly todo: string) {}

  visit(visitor: Visitor): void {
    visitor.visitTypeMap(this);
  }
}
