import type { IdlTypeArray } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';

export class TypeArrayNode implements Visitable {
  readonly nodeType = 'array' as const;

  constructor(readonly itemType: TypeNode, readonly size: number) {}

  static fromIdl(idl: IdlTypeArray): TypeArrayNode {
    const itemType = createTypeNodeFromIdl(idl.array[0]);
    return new TypeArrayNode(itemType, idl.array[1]);
  }

  visit(visitor: Visitor): void {
    visitor.visitTypeArray(this);
  }

  visitChildren(visitor: Visitor): void {
    this.itemType.visit(visitor);
  }
}
