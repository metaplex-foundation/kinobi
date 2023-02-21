import type { IdlTypeSet } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import { TypeNumberNode } from './TypeNumberNode';

export class TypeSetNode implements Visitable {
  readonly nodeClass = 'TypeSetNode' as const;

  readonly item: TypeNode;

  readonly size:
    | { kind: 'fixed'; size: number }
    | { kind: 'prefixed'; prefix: TypeNumberNode }
    | { kind: 'remainder' };

  readonly idlType: 'hashSet' | 'bTreeSet';

  constructor(
    item: TypeNode,
    options: {
      size?: TypeSetNode['size'];
      idlType?: TypeSetNode['idlType'];
    } = {}
  ) {
    this.item = item;
    this.size = options.size ?? {
      kind: 'prefixed',
      prefix: new TypeNumberNode('u32'),
    };
    this.idlType = options.idlType ?? 'hashSet';
  }

  static fromIdl(idl: IdlTypeSet): TypeSetNode {
    const idlType = 'hashSet' in idl ? 'hashSet' : 'bTreeSet';
    const item = 'hashSet' in idl ? idl.hashSet : idl.bTreeSet;
    let size: TypeSetNode['size'] | undefined;
    if (idl.size === 'remainder') {
      size = { kind: 'remainder' };
    } else if (typeof idl.size === 'number') {
      size = { kind: 'fixed', size: idl.size };
    } else if (idl.size) {
      size = { kind: 'prefixed', prefix: new TypeNumberNode(idl.size) };
    }
    return new TypeSetNode(createTypeNodeFromIdl(item), { idlType, size });
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
