import type { IdlTypeTuple } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';

export class TypeTupleNode implements Visitable {
  readonly nodeType = 'tuple' as const;

  constructor(readonly itemTypes: TypeNode[]) {}

  static fromIdl(idl: IdlTypeTuple): TypeTupleNode {
    return new TypeTupleNode(idl.tuple.map(createTypeNodeFromIdl));
  }

  visit(visitor: Visitor): void {
    visitor.visitTypeTuple(this);
  }

  visitChildren(visitor: Visitor): void {
    this.itemTypes.forEach((type) => type.visit(visitor));
  }
}
