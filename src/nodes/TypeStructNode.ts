import type { IdlTypeStruct } from 'src/idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';

export type TypeStructNodeField = {
  name: string;
  type: TypeNode;
  docs?: string[];
};

export class TypeStructNode implements Visitable {
  readonly nodeType = 'struct' as const;

  constructor(readonly fields: TypeStructNodeField[]) {}

  static fromIdl(idl: Partial<IdlTypeStruct>): TypeStructNode {
    const fields = (idl.fields ?? []).map((field) => ({
      name: field.name ?? '',
      type: createTypeNodeFromIdl(field.type),
      docs: field.docs ?? [],
    }));

    return new TypeStructNode(fields);
  }

  visit(visitor: Visitor): void {
    visitor.visitTypeStruct(this);
  }

  visitChildren(visitor: Visitor): void {
    this.fields.forEach((field) => field.type.visit(visitor));
  }
}
