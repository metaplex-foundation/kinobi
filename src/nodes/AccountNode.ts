import type { IdlAccount } from 'src/idl';
import type { Visitable, Visitor } from '../visitors';

export class AccountNode implements Visitable {
  constructor(
    readonly name: string,
    // readonly type: TypeStructNode,
    readonly docs: string[] = [],
  ) {}

  visit(visitor: Visitor): void {
    visitor.visitAccount(this);
  }
}

export function parseAccountNode(idl: Partial<IdlAccount>): AccountNode {
  const name = idl.name ?? '';
  const docs = idl.docs ?? [];
  return new AccountNode(name, docs);
}
