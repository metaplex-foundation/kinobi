import type { IdlTypeLeaf } from '../idl';
import { VALID_LEAF_TYPES } from '../idl/IdlType';
import type { Visitable, Visitor } from '../visitors';

export class TypeLeafNode implements Visitable {
  readonly nodeType = 'leaf' as const;

  constructor(readonly type: IdlTypeLeaf) {}

  static isValidType(type: IdlTypeLeaf): boolean {
    return VALID_LEAF_TYPES.includes(type);
  }

  visit(visitor: Visitor): void {
    visitor.visitTypeLeaf(this);
  }
}
