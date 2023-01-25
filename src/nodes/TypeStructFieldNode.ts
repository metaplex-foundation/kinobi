import { mainCase } from '../utils';
import type { IdlTypeStructField } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import type { Node } from './Node';

export type TypeStructFieldNodeMetadata = {
  name: string;
  docs: string[];
  defaultsTo: TypeStructFieldNodeDefaults;
};

export type TypeStructFieldNodeDefaults =
  | (TypeStructFieldNodeDefaultValue & { strategy: 'optional' | 'omitted' })
  | { kind: 'none' };

export type TypeStructFieldNodeDefaultValue =
  | { kind: 'json'; value: any }
  | { kind: 'someOption'; value: TypeStructFieldNodeDefaultValue }
  | { kind: 'noneOption' };

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
            ? { kind: 'json', strategy: 'optional', value: idl.defaultsValue }
            : { kind: 'none' },
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
