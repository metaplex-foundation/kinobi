import type { IdlTypeEnum } from 'src/idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';

export type TypeEnumNodeVariant = {
  name: string;
  fields:
    | TypeEnumNodeVariantNamedField[]
    | TypeEnumNodeVariantTupleField[]
    | null;
};

export type TypeEnumNodeVariantNamedField = {
  kind: 'named';
  name: string;
  type: TypeNode;
  docs: string[];
};

export type TypeEnumNodeVariantTupleField = {
  kind: 'tuple';
  type: TypeNode;
  docs: string[];
};

export class TypeEnumNode implements Visitable {
  readonly nodeType = 'enum' as const;

  constructor(
    readonly name: string | null,
    readonly variants: TypeEnumNodeVariant[],
  ) {}

  static fromIdl(idl: IdlTypeEnum): TypeEnumNode {
    const name = idl.name ?? null;
    const variants = idl.variants.map((variant): TypeEnumNodeVariant => {
      const fields = (variant.fields ?? []).map((field) => {
        if (typeof field === 'object' && 'name' in field && 'type' in field) {
          return {
            kind: 'named',
            name: field.name,
            type: createTypeNodeFromIdl(field.type),
            docs: field.docs ?? [],
          };
        }
        return { kind: 'tuple', type: createTypeNodeFromIdl(field) };
      }) as TypeEnumNodeVariantNamedField[] | TypeEnumNodeVariantTupleField[];

      return {
        name: variant.name,
        fields: fields.length === 0 ? null : fields,
      };
    });

    return new TypeEnumNode(name, variants);
  }

  visit(visitor: Visitor): void {
    visitor.visitTypeEnum(this);
  }

  visitChildren(visitor: Visitor): void {
    this.variants.forEach((variant) => {
      (variant.fields ?? []).forEach((field) => {
        field.type.visit(visitor);
      });
    });
  }
}
