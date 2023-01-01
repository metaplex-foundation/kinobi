import type { IdlTypeStruct } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import type { Node } from './Node';

export type TypeStructNodeFieldDefaults = {
  value: any;
  strategy: 'optional' | 'omitted';
};

export type TypeStructNodeField = {
  name: string;
  type: TypeNode;
  docs: string[];
  defaultsTo: TypeStructNodeFieldDefaults | null;
};

export class TypeStructNode implements Visitable {
  readonly nodeClass = 'TypeStructNode' as const;

  constructor(readonly name: string, readonly fields: TypeStructNodeField[]) {}

  static fromIdl(idl: IdlTypeStruct): TypeStructNode {
    const fields = (idl.fields ?? []).map((field) => ({
      name: field.name ?? '',
      type: createTypeNodeFromIdl(field.type),
      docs: field.docs ?? [],
      defaultsTo:
        field.defaultsValue !== undefined
          ? { strategy: 'optional' as const, value: field.defaultsValue }
          : null,
    }));
    return new TypeStructNode(idl.name ?? '', fields);
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
