import type { IdlTypeOption } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import type { Node } from './Node';

export class TypeOptionNode implements Visitable {
  readonly nodeClass = 'TypeOptionNode' as const;

  constructor(
    readonly optionType: 'option' | 'coption',
    readonly type: TypeNode
  ) {}

  static fromIdl(idl: IdlTypeOption): TypeOptionNode {
    const optionType = 'option' in idl ? 'option' : 'coption';
    const idlType = 'option' in idl ? idl.option : idl.coption;
    return new TypeOptionNode(optionType, createTypeNodeFromIdl(idlType));
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeOption(this);
  }
}

export function isTypeOptionNode(node: Node): node is TypeOptionNode {
  return node.nodeClass === 'TypeOptionNode';
}

export function assertTypeOptionNode(
  node: Node
): asserts node is TypeOptionNode {
  if (!isTypeOptionNode(node)) {
    throw new Error(`Expected TypeOptionNode, got ${node.nodeClass}.`);
  }
}
