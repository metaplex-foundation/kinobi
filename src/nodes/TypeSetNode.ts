import type { IdlTypeSet } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import { NumberTypeNode } from './NumberTypeNode';

export class SetTypeNode implements Visitable {
  readonly nodeClass = 'SetTypeNode' as const;

  readonly item: TypeNode;

  readonly size:
    | { kind: 'fixed'; size: number }
    | { kind: 'prefixed'; prefix: NumberTypeNode }
    | { kind: 'remainder' };

  readonly idlType: 'hashSet' | 'bTreeSet';

  constructor(
    item: TypeNode,
    options: {
      size?: SetTypeNode['size'];
      idlType?: SetTypeNode['idlType'];
    } = {}
  ) {
    this.item = item;
    this.size = options.size ?? {
      kind: 'prefixed',
      prefix: new NumberTypeNode('u32'),
    };
    this.idlType = options.idlType ?? 'hashSet';
  }

  static fromIdl(idl: IdlTypeSet): SetTypeNode {
    const idlType = 'hashSet' in idl ? 'hashSet' : 'bTreeSet';
    const item = 'hashSet' in idl ? idl.hashSet : idl.bTreeSet;
    let size: SetTypeNode['size'] | undefined;
    if (idl.size === 'remainder') {
      size = { kind: 'remainder' };
    } else if (typeof idl.size === 'number') {
      size = { kind: 'fixed', size: idl.size };
    } else if (idl.size) {
      size = { kind: 'prefixed', prefix: new NumberTypeNode(idl.size) };
    }
    return new SetTypeNode(createTypeNodeFromIdl(item), { idlType, size });
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeSet(this);
  }
}

export function isSetTypeNode(node: Node | null): node is SetTypeNode {
  return !!node && node.nodeClass === 'SetTypeNode';
}

export function assertSetTypeNode(
  node: Node | null
): asserts node is SetTypeNode {
  if (!isSetTypeNode(node)) {
    throw new Error(`Expected SetTypeNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
