import type { IdlTypeStruct } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { TypeStructFieldNode } from './TypeStructFieldNode';

export class TypeStructNode implements Visitable {
  readonly nodeClass = 'TypeStructNode' as const;

  constructor(readonly name: string, readonly fields: TypeStructFieldNode[]) {}

  static fromIdl(idl: IdlTypeStruct): TypeStructNode {
    return new TypeStructNode(
      idl.name ?? '',
      (idl.fields ?? []).map(TypeStructFieldNode.fromIdl)
    );
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeStruct(this);
  }
}

export function isTypeStructNode(node: Node | null): node is TypeStructNode {
  return !!node && node.nodeClass === 'TypeStructNode';
}

export function assertTypeStructNode(
  node: Node | null
): asserts node is TypeStructNode {
  if (!isTypeStructNode(node)) {
    throw new Error(
      `Expected TypeStructNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
