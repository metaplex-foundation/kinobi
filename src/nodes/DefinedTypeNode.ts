import type { IdlDefinedType } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { TypeEnumNode } from './TypeEnumNode';
import { createTypeNodeFromIdl } from './TypeNode';
import { TypeStructNode } from './TypeStructNode';

export class DefinedTypeNode implements Visitable {
  constructor(
    readonly name: string,
    readonly type: TypeStructNode | TypeEnumNode,
    readonly docs: string[],
  ) {}

  static fromIdl(idl: Partial<IdlDefinedType>): DefinedTypeNode {
    const name = idl.name ?? '';
    const type = createTypeNodeFromIdl(
      idl.type ?? { kind: 'struct', fields: [] },
    ) as TypeStructNode | TypeEnumNode;
    const docs = idl.docs ?? [];
    return new DefinedTypeNode(name, type, docs);
  }

  visit(visitor: Visitor): void {
    visitor.visitDefinedType(this);
  }

  visitChildren(visitor: Visitor): void {
    this.type.visit(visitor);
  }
}
