import type { IdlTypeSet } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import type { Node } from './Node';

export class TypeSetNode implements Visitable {
  readonly nodeClass = 'TypeSetNode' as const;

  constructor(
    readonly setType: 'hashSet' | 'bTreeSet',
    readonly type: TypeNode
  ) {}

  static fromIdl(idl: IdlTypeSet): TypeSetNode {
    const setType = 'hashSet' in idl ? 'hashSet' : 'bTreeSet';
    const idlType = 'hashSet' in idl ? idl.hashSet : idl.bTreeSet;
    return new TypeSetNode(setType, createTypeNodeFromIdl(idlType));
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeSet(this);
  }
}

export function isTypeSetNode(node: Node | null): node is TypeSetNode {
  return !!node && node.nodeClass === 'TypeSetNode';
}

export function assertTypeSetNode(
  node: Node | null
): asserts node is TypeSetNode {
  if (!isTypeSetNode(node)) {
    throw new Error(`Expected TypeSetNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
