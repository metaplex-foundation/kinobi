import type { IdlTypeLeaf } from '../idl';
import type { Visitable, Visitor } from '../visitors';

export class TypeLeafNode implements Visitable {
  readonly nodeType = 'leaf' as const;

  constructor(readonly type: IdlTypeLeaf) {}

  visit(visitor: Visitor): void {
    visitor.visitTypeLeaf(this);
  }
}
