import type { IdlTypeStructField } from '../idl';
import { mainCase } from '../utils';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import { ValueNode, vScalar } from './ValueNode';

export type TypeStructFieldNodeMetadata = {
  name: string;
  docs: string[];
  defaultsTo: { strategy: 'optional' | 'omitted'; value: ValueNode } | null;
};

export class TypeStructFieldNode implements Visitable {
  readonly nodeClass = 'TypeStructFieldNode' as const;

  readonly metadata: TypeStructFieldNodeMetadata;

  readonly type: TypeNode;

  constructor(metadata: TypeStructFieldNodeMetadata, type: TypeNode) {
    this.metadata = { ...metadata, name: mainCase(metadata.name) };
    this.type = type;
  }

  static fromIdl(idl: IdlTypeStructField): TypeStructFieldNode {
    return new TypeStructFieldNode(
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

export function isTypeStructFieldNode(
  node: Node | null
): node is TypeStructFieldNode {
  return !!node && node.nodeClass === 'TypeStructFieldNode';
}

export function assertTypeStructFieldNode(
  node: Node | null
): asserts node is TypeStructFieldNode {
  if (!isTypeStructFieldNode(node)) {
    throw new Error(
      `Expected TypeStructFieldNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
