import { mainCase } from '../utils';
import type { IdlTypeStruct } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { StructFieldTypeNode } from './StructFieldTypeNode';

export class StructTypeNode implements Visitable {
  readonly nodeClass = 'StructTypeNode' as const;

  readonly name: string;

  readonly fields: StructFieldTypeNode[];

  constructor(name: string, fields: StructFieldTypeNode[]) {
    this.name = mainCase(name);
    this.fields = fields;
  }

  static fromIdl(idl: IdlTypeStruct): StructTypeNode {
    return new StructTypeNode(
      idl.name ?? '',
      (idl.fields ?? []).map(StructFieldTypeNode.fromIdl)
    );
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeStruct(this);
  }
}

export function isStructTypeNode(node: Node | null): node is StructTypeNode {
  return !!node && node.nodeClass === 'StructTypeNode';
}

export function assertStructTypeNode(
  node: Node | null
): asserts node is StructTypeNode {
  if (!isStructTypeNode(node)) {
    throw new Error(
      `Expected StructTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
