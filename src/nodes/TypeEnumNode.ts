import type { IdlTypeEnum } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { TypeEnumEmptyVariantNode } from './TypeEnumEmptyVariantNode';
import { TypeEnumStructVariantNode } from './TypeEnumStructVariantNode';
import { TypeEnumTupleVariantNode } from './TypeEnumTupleVariantNode';
import type { TypeEnumVariantNode } from './TypeEnumVariantNode';

export class TypeEnumNode implements Visitable {
  readonly nodeClass = 'TypeEnumNode' as const;

  constructor(
    readonly name: string,
    readonly variants: TypeEnumVariantNode[]
  ) {}

  static fromIdl(idl: IdlTypeEnum): TypeEnumNode {
    const variants = idl.variants.map((variant): TypeEnumVariantNode => {
      if (!variant.fields || variant.fields.length <= 0) {
        return TypeEnumEmptyVariantNode.fromIdl(variant);
      }

      if (isStructField(variant.fields[0])) {
        return TypeEnumStructVariantNode.fromIdl(variant);
      }

      return TypeEnumTupleVariantNode.fromIdl(variant);
    });

    return new TypeEnumNode(idl.name ?? '', variants);
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeEnum(this);
  }

  isScalarEnum(): boolean {
    return this.variants.every(
      (variant) => variant.nodeClass === 'TypeEnumEmptyVariantNode'
    );
  }

  isDataEnum(): boolean {
    return !this.isScalarEnum();
  }
}

export function isTypeEnumNode(node: Node | null): node is TypeEnumNode {
  return !!node && node.nodeClass === 'TypeEnumNode';
}

export function assertTypeEnumNode(
  node: Node | null
): asserts node is TypeEnumNode {
  if (!isTypeEnumNode(node)) {
    throw new Error(`Expected TypeEnumNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}

function isStructField(field: any): boolean {
  return typeof field === 'object' && 'name' in field && 'type' in field;
}
