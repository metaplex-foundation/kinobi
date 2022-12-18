import type { IdlType, IdlTypeEnum, IdlTypeEnumField } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import { TypeStructNode } from './TypeStructNode';
import type { Node } from './Node';

export type TypeEnumNodeVariant =
  | TypeEnumNodeStructVariant
  | TypeEnumNodeTupleVariant
  | TypeEnumNodeEmptyVariant;

export type TypeEnumNodeStructVariant = {
  kind: 'struct';
  name: string;
  type: TypeStructNode;
};

export type TypeEnumNodeTupleVariant = {
  kind: 'tuple';
  name: string;
  fields: TypeNode[];
};

export type TypeEnumNodeEmptyVariant = {
  kind: 'empty';
  name: string;
};

export class TypeEnumNode implements Visitable {
  readonly nodeClass = 'TypeEnumNode' as const;

  constructor(
    readonly name: string | null,
    readonly variants: TypeEnumNodeVariant[],
  ) {}

  static fromIdl(idl: IdlTypeEnum): TypeEnumNode {
    const name = idl.name ?? null;
    const variants = idl.variants.map((variant): TypeEnumNodeVariant => {
      const variantName = variant.name ?? '';

      if (!variant.fields || variant.fields.length <= 0) {
        return { kind: 'empty', name: variantName };
      }

      function isStructField(field: any): boolean {
        return typeof field === 'object' && 'name' in field && 'type' in field;
      }

      if (isStructField(variant.fields[0])) {
        const variantFields = variant.fields as IdlTypeEnumField[];
        return {
          kind: 'struct',
          name: variantName,
          type: new TypeStructNode(
            variantFields.map((field) => ({
              name: field.name,
              type: createTypeNodeFromIdl(field.type),
              docs: field.docs ?? [],
            })),
          ),
        };
      }

      const variantFields = variant.fields as IdlType[];
      return {
        kind: 'tuple',
        name: variantName,
        fields: variantFields.map((field) => createTypeNodeFromIdl(field)),
      };
    });

    return new TypeEnumNode(name, variants);
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeEnum(this);
  }
}

export function isTypeEnumNode(node: Node): node is TypeEnumNode {
  return node.nodeClass === 'TypeEnumNode';
}

export function assertTypeEnumNode(node: Node): asserts node is TypeEnumNode {
  if (!isTypeEnumNode(node)) {
    throw new Error(`Expected TypeEnumNode, got ${node.nodeClass}.`);
  }
}
