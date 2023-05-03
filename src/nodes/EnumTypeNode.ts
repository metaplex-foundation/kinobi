import type { IdlTypeEnum } from '../idl';
import { enumEmptyVariantTypeNodeFromIdl } from './EnumEmptyVariantTypeNode';
import { enumStructVariantTypeNodeFromIdl } from './EnumStructVariantTypeNode';
import { enumTupleVariantTypeNodeFromIdl } from './EnumTupleVariantTypeNode';
import type { EnumVariantTypeNode } from './EnumVariantTypeNode';
import type { Node } from './Node';
import { NumberTypeNode, numberTypeNode } from './NumberTypeNode';

export type EnumTypeNode = {
  readonly __enumTypeNode: unique symbol;
  readonly kind: 'enumTypeNode';
  readonly variants: EnumVariantTypeNode[];
  readonly size: NumberTypeNode;
};

export function enumTypeNode(
  variants: EnumVariantTypeNode[],
  options: { size?: NumberTypeNode } = {}
): EnumTypeNode {
  return {
    kind: 'enumTypeNode',
    variants,
    size: options.size ?? numberTypeNode('u8'),
  } as EnumTypeNode;
}

export function enumTypeNodeFromIdl(idl: IdlTypeEnum): EnumTypeNode {
  const variants = idl.variants.map((variant): EnumVariantTypeNode => {
    if (!variant.fields || variant.fields.length <= 0) {
      return enumEmptyVariantTypeNodeFromIdl(variant);
    }
    if (isStructField(variant.fields[0])) {
      return enumStructVariantTypeNodeFromIdl(variant);
    }
    return enumTupleVariantTypeNodeFromIdl(variant);
  });
  return enumTypeNode(variants, {
    size: idl.size ? numberTypeNode(idl.size) : undefined,
  });
}

export function isScalarEnum(node: EnumTypeNode): boolean {
  return node.variants.every(
    (variant) => variant.kind === 'enumEmptyVariantTypeNode'
  );
}

export function isDataEnum(node: EnumTypeNode): boolean {
  return !isScalarEnum(node);
}

export function isEnumTypeNode(node: Node | null): node is EnumTypeNode {
  return !!node && node.kind === 'enumTypeNode';
}

export function assertEnumTypeNode(
  node: Node | null
): asserts node is EnumTypeNode {
  if (!isEnumTypeNode(node)) {
    throw new Error(`Expected enumTypeNode, got ${node?.kind ?? 'null'}.`);
  }
}

function isStructField(field: any): boolean {
  return typeof field === 'object' && 'name' in field && 'type' in field;
}
