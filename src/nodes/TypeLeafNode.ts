import type { IdlTypeLeaf } from 'src/idl';
import type { Visitable, Visitor } from '../visitors';

export class TypeLeafNode implements Visitable {
  readonly type: IdlTypeLeaf;

  constructor(type: IdlTypeLeaf) {
    this.type = type;
  }

  visit(visitor: Visitor): void {
    visitor.visitTypeLeaf(this);
  }
}
