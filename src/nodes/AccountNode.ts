import type { Visitable, Visitor } from '../visitors';

export class AccountNode implements Visitable {
  visit(visitor: Visitor): void {
    visitor.visitAccount(this);
  }
}
