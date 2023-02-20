import type { IdlTypeArray, IdlTypeVec } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import { TypeNumberNode } from './TypeNumberNode';

export class TypeArrayNode implements Visitable {
  readonly nodeClass = 'TypeArrayNode' as const;

  readonly item: TypeNode;

  readonly size:
    | { kind: 'fixed'; size: number }
    | { kind: 'prefixed'; prefix: TypeNumberNode }
    | { kind: 'remainder' };

  constructor(options: { item: TypeNode; size?: TypeArrayNode['size'] }) {
    this.item = options.item;
    this.size = options.size ?? {
      kind: 'prefixed',
      prefix: new TypeNumberNode('u32'),
    };
  }

  static fromIdl(idl: IdlTypeArray | IdlTypeVec): TypeArrayNode {
    if ('vec' in idl) {
      const item = createTypeNodeFromIdl(idl.vec);
      return new TypeArrayNode({ item });
    }

    const item = createTypeNodeFromIdl(idl.array[0]);
    return new TypeArrayNode({
      item,
      size: { kind: 'fixed', size: idl.array[1] },
    });
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeArray(this);
  }
}

export function isTypeArrayNode(node: Node | null): node is TypeArrayNode {
  return !!node && node.nodeClass === 'TypeArrayNode';
}

export function assertTypeArrayNode(
  node: Node | null
): asserts node is TypeArrayNode {
  if (!isTypeArrayNode(node)) {
    throw new Error(
      `Expected TypeArrayNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
