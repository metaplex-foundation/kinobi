import type { IdlTypeOption } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';

export class TypeOptionNode implements Visitable {
  readonly nodeType = 'option' as const;

  constructor(
    readonly optionType: 'option' | 'coption',
    readonly type: TypeNode,
  ) {}

  static fromIdl(idl: IdlTypeOption): TypeOptionNode {
    const optionType = 'option' in idl ? 'option' : 'coption';
    const idlType = 'option' in idl ? idl.option : idl.coption;
    return new TypeOptionNode(optionType, createTypeNodeFromIdl(idlType));
  }

  visit(visitor: Visitor): void {
    visitor.visitTypeOption(this);
  }

  visitChildren(visitor: Visitor): void {
    this.type.visit(visitor);
  }
}
