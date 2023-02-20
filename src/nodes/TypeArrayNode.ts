import type { IdlTypeArray } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { TypeLeafNode } from './TypeLeafNode';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';

export type TypeArrayNodeMetadata = {
  size:
    | { kind: 'fixed'; number: number }
    | { kind: 'prefixed'; prefix: TypeLeafNode } // TODO: Unsigned Number?
    | { kind: 'remainder' };
};

export class TypeArrayNode implements Visitable {
  readonly nodeClass = 'TypeArrayNode' as const;

  readonly metadata: TypeArrayNodeMetadata;

  readonly itemType: TypeNode;

  constructor(metadata: TypeArrayNodeMetadata, itemType: TypeNode) {
    this.metadata = metadata;
    this.itemType = itemType;
  }

  static fromIdl(idl: IdlTypeArray): TypeArrayNode {
    const itemType = createTypeNodeFromIdl(idl.array[0]);
    return new TypeArrayNode(itemType, idl.array[1]);

    // return new TypeVecNode(createTypeNodeFromIdl(idl.vec));
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
