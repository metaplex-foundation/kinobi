import type { IdlTypeArray } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';

export class TypeArrayNode implements Visitable {
  readonly nodeClass = 'TypeArrayNode' as const;

  constructor(readonly itemType: TypeNode, readonly size: number) {}

  static fromIdl(idl: IdlTypeArray): TypeArrayNode {
    const itemType = createTypeNodeFromIdl(idl.array[0]);
    return new TypeArrayNode(itemType, idl.array[1]);
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeArray(this);
  }
}

export function isTypeArrayNode(node: Node): node is TypeArrayNode {
  return node.nodeClass === 'TypeArrayNode';
}

export function assertTypeArrayNode(node: Node): asserts node is TypeArrayNode {
  if (!isTypeArrayNode(node)) {
    throw new Error(`Expected TypeArrayNode, got ${node.nodeClass}.`);
  }
}
