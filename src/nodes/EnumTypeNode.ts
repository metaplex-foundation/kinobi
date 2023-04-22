import type { IdlTypeEnum } from '../idl';
import { InvalidKinobiTreeError, mainCase } from '../shared';
import { enumEmptyVariantTypeNodeFromIdl } from './EnumEmptyVariantTypeNode';
import { enumStructVariantTypeNodeFromIdl } from './EnumStructVariantTypeNode';
import { enumTupleVariantTypeNodeFromIdl } from './EnumTupleVariantTypeNode';
import type { EnumVariantTypeNode } from './EnumVariantTypeNode';
import type { Node } from './Node';

export type EnumTypeNode = {
  readonly __enumTypeNode: unique symbol;
  readonly nodeClass: 'enumTypeNode';
  readonly name: string;
  readonly variants: EnumVariantTypeNode[];
};

export function enumTypeNode(
  name: string,
  variants: EnumVariantTypeNode[]
): EnumTypeNode {
  if (!name) {
    throw new InvalidKinobiTreeError('EnumTypeNode must have a name.');
  }
  return {
    nodeClass: 'enumTypeNode',
    name: mainCase(name),
    variants,
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
  return enumTypeNode(idl.name ?? '', variants);
}

export function isScalarEnum(node: EnumTypeNode): boolean {
  return node.variants.every(
    (variant) => variant.nodeClass === 'enumEmptyVariantTypeNode'
  );
}

export function isDataEnum(node: EnumTypeNode): boolean {
  return !isScalarEnum(node);
}

export function isEnumTypeNode(node: Node | null): node is EnumTypeNode {
  return !!node && node.nodeClass === 'enumTypeNode';
}

export function assertEnumTypeNode(
  node: Node | null
): asserts node is EnumTypeNode {
  if (!isEnumTypeNode(node)) {
    throw new Error(`Expected EnumTypeNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}

function isStructField(field: any): boolean {
  return typeof field === 'object' && 'name' in field && 'type' in field;
}
