import type { IdlTypeArray, IdlTypeVec } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import { NumberTypeNode } from './NumberTypeNode';

export class ArrayTypeNode implements Visitable {
  readonly nodeClass = 'ArrayTypeNode' as const;

  readonly item: TypeNode;

  readonly size:
    | { kind: 'fixed'; size: number }
    | { kind: 'prefixed'; prefix: NumberTypeNode }
    | { kind: 'remainder' };

  constructor(item: TypeNode, options: { size?: ArrayTypeNode['size'] } = {}) {
    this.item = item;
    this.size = options.size ?? {
      kind: 'prefixed',
      prefix: new NumberTypeNode('u32'),
    };
  }

  static fromIdl(idl: IdlTypeArray | IdlTypeVec): ArrayTypeNode {
    if ('array' in idl) {
      const item = createTypeNodeFromIdl(idl.array[0]);
      return new ArrayTypeNode(item, {
        size: { kind: 'fixed', size: idl.array[1] },
      });
    }

    const item = createTypeNodeFromIdl(idl.vec);
    if (!idl.size) return new ArrayTypeNode(item);
    if (idl.size === 'remainder') {
      return new ArrayTypeNode(item, { size: { kind: 'remainder' } });
    }
    return new ArrayTypeNode(item, {
      size: { kind: 'prefixed', prefix: new NumberTypeNode(idl.size) },
    });
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeArray(this);
  }
}

export function isArrayTypeNode(node: Node | null): node is ArrayTypeNode {
  return !!node && node.nodeClass === 'ArrayTypeNode';
}

export function assertArrayTypeNode(
  node: Node | null
): asserts node is ArrayTypeNode {
  if (!isArrayTypeNode(node)) {
    throw new Error(
      `Expected ArrayTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
