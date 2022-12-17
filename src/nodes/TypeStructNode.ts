import type { Visitable, Visitor } from '../visitors';
import type { TypeNode } from './TypeNode';

export type TypeStructNodeField = {
  name: string;
  type: TypeNode;
  docs?: string[];
};

export class TypeStructNode implements Visitable {
  readonly nodeType = 'struct' as const;

  constructor(readonly fields: TypeStructNodeField[]) {}

  visit(visitor: Visitor): void {
    visitor.visitTypeStruct(this);
  }

  visitChildren(visitor: Visitor): void {
    this.fields.forEach((field) => field.type.visit(visitor));
  }
}
