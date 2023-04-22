import type { IdlTypeStructField } from '../idl';
import { mainCase } from '../utils';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import { ValueNode, vScalar } from './ValueNode';

export type StructFieldTypeNodeMetadata = {
  name: string;
  docs: string[];
  defaultsTo: { strategy: 'optional' | 'omitted'; value: ValueNode } | null;
};

export class StructFieldTypeNode implements Visitable {
  readonly nodeClass = 'StructFieldTypeNode' as const;

  readonly metadata: StructFieldTypeNodeMetadata;

  readonly type: TypeNode;

  constructor(metadata: StructFieldTypeNodeMetadata, type: TypeNode) {
    this.metadata = { ...metadata, name: mainCase(metadata.name) };
    this.type = type;
  }

  static fromIdl(idl: IdlTypeStructField): StructFieldTypeNode {
    return new StructFieldTypeNode(
      {
        name: idl.name ?? '',
        docs: idl.docs ?? [],
        defaultsTo:
          idl.defaultsValue !== undefined
            ? { strategy: 'optional', value: vScalar(idl.defaultsValue) }
            : null,
      },
      createTypeNodeFromIdl(idl.type)
    );
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeStructField(this);
  }

  get name(): string {
    return this.metadata.name;
  }
}

export function isStructFieldTypeNode(
  node: Node | null
): node is StructFieldTypeNode {
  return !!node && node.nodeClass === 'StructFieldTypeNode';
}

export function assertStructFieldTypeNode(
  node: Node | null
): asserts node is StructFieldTypeNode {
  if (!isStructFieldTypeNode(node)) {
    throw new Error(
      `Expected StructFieldTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
