import type { IdlAccount } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl } from './TypeNode';
import { TypeStructNode } from './TypeStructNode';

export class AccountNode implements Visitable {
  constructor(
    readonly name: string,
    readonly type: TypeStructNode,
    readonly docs: string[] = [],
  ) {}

  static fromIdl(idl: Partial<IdlAccount>): AccountNode {
    const name = idl.name ?? '';
    const type = createTypeNodeFromIdl(
      idl.type ?? { kind: 'struct', fields: [] },
    ) as TypeStructNode;
    const docs = idl.docs ?? [];
    return new AccountNode(name, type, docs);
  }

  visit(visitor: Visitor): void {
    visitor.visitAccount(this);
  }
}
