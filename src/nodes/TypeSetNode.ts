import type { IdlTypeSet } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';

export class TypeSetNode implements Visitable {
  readonly nodeType = 'set' as const;

  constructor(
    readonly setType: 'hashSet' | 'bTreeSet',
    readonly type: TypeNode,
  ) {}

  static fromIdl(idl: IdlTypeSet): TypeSetNode {
    const setType = 'hashSet' in idl ? 'hashSet' : 'bTreeSet';
    const idlType = 'hashSet' in idl ? idl.hashSet : idl.bTreeSet;
    return new TypeSetNode(setType, createTypeNodeFromIdl(idlType));
  }

  visit(visitor: Visitor): void {
    visitor.visitTypeSet(this);
  }

  visitChildren(visitor: Visitor): void {
    this.type.visit(visitor);
  }
}
