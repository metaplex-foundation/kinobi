import type { IdlType, IdlTypeEnum, IdlTypeEnumField } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { TypeStructNode } from './TypeStructNode';
import { TypeTupleNode } from './TypeTupleNode';

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
  type: TypeTupleNode;
};

export type TypeEnumNodeEmptyVariant = {
  kind: 'empty';
  name: string;
};

export class TypeEnumNode implements Visitable {
  readonly nodeClass = 'TypeEnumNode' as const;

  constructor(
    readonly name: string,
    readonly variants: TypeEnumNodeVariant[],
  ) {}

  static fromIdl(idl: IdlTypeEnum): TypeEnumNode {
    const name = idl.name ?? '';
    const variants = idl.variants.map((variant): TypeEnumNodeVariant => {
      const variantName = variant.name ?? '';
      const namespacedVariantName = [name, variantName]
        .filter((n) => !!n)
        .join('.');

      if (!variant.fields || variant.fields.length <= 0) {
        return { kind: 'empty', name: namespacedVariantName };
      }

      function isStructField(field: any): boolean {
        return typeof field === 'object' && 'name' in field && 'type' in field;
      }

      if (isStructField(variant.fields[0])) {
        return {
          kind: 'struct',
          name: namespacedVariantName,
          type: TypeStructNode.fromIdl({
            kind: 'struct',
            name: variantName,
            fields: variant.fields as IdlTypeEnumField[],
          }),
        };
      }

      return {
        kind: 'tuple',
        name: namespacedVariantName,
        type: TypeTupleNode.fromIdl({ tuple: variant.fields as IdlType[] }),
      };
    });

    return new TypeEnumNode(name, variants);
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeEnum(this);
  }

  isScalarEnum(): boolean {
    return this.variants.every((variant) => variant.kind === 'empty');
  }

  isDataEnum(): boolean {
    return !this.isScalarEnum();
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
