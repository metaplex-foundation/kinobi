import type { Visitable, Visitor } from '../visitors';

export class TypeDefinedLinkNode implements Visitable {
  readonly nodeType = 'definedLink' as const;

  constructor(readonly definedType: string) {}

  visit(visitor: Visitor): void {
    visitor.visitTypeDefinedLink(this);
  }
}
