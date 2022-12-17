import type { Visitable, Visitor } from '../visitors';

export class TypeEnumNode implements Visitable {
  readonly nodeType = 'enum' as const;

  constructor(readonly todo: string) {}

  visit(visitor: Visitor): void {
    visitor.visitTypeEnum(this);
  }
}
