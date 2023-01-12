import type { IdlTypeStructField } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import type { Node } from './Node';

// TODO: Support "address", "program" and "programId" defaults.
export type TypeStructFieldNodeDefaults = {
  value: any;
  strategy: 'optional' | 'omitted';
};

export type TypeStructFieldNodeMetadata = {
  name: string;
  docs: string[];
  defaultsTo: TypeStructFieldNodeDefaults | null;
};

export class TypeStructFieldNode implements Visitable {
  readonly nodeClass = 'TypeStructFieldNode' as const;

  constructor(
    readonly metadata: TypeStructFieldNodeMetadata,
    readonly type: TypeNode
  ) {}

  static fromIdl(idl: IdlTypeStructField): TypeStructFieldNode {
    const metadata = {
      name: idl.name ?? '',
      docs: idl.docs ?? [],
      defaultsTo:
        idl.defaultsValue !== undefined
          ? { strategy: 'optional' as const, value: idl.defaultsValue }
          : null,
    };

    return new TypeStructFieldNode(metadata, createTypeNodeFromIdl(idl.type));
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
