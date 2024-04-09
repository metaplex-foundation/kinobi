import type { ResolveNestedTypeNode } from './TypeNode';
import type { IdlTypeEnum } from '../../idl';
import { enumEmptyVariantTypeNodeFromIdl } from './EnumEmptyVariantTypeNode';
import { enumStructVariantTypeNodeFromIdl } from './EnumStructVariantTypeNode';
import { enumTupleVariantTypeNodeFromIdl } from './EnumTupleVariantTypeNode';
import type { EnumVariantTypeNode } from './EnumVariantTypeNode';
import { NumberTypeNode, numberTypeNode } from './NumberTypeNode';

export interface EnumTypeNode<
  TVariants extends EnumVariantTypeNode[] = EnumVariantTypeNode[],
  TSize extends
    ResolveNestedTypeNode<NumberTypeNode> = ResolveNestedTypeNode<NumberTypeNode>,
> {
  readonly kind: 'enumTypeNode';

  // Children.
  readonly variants: TVariants;
  readonly size: TSize;
}

export function enumTypeNode<
  const TVariants extends EnumVariantTypeNode[],
  TSize extends ResolveNestedTypeNode<NumberTypeNode> = NumberTypeNode<'u8'>,
>(
  variants: TVariants,
  options: { size?: TSize } = {}
): EnumTypeNode<TVariants, TSize> {
  return {
    kind: 'enumTypeNode',
    variants,
    size: (options.size ?? numberTypeNode('u8')) as TSize,
  };
}

export function enumTypeNodeFromIdl(
  idl: IdlTypeEnum
): EnumTypeNode<EnumVariantTypeNode[], NumberTypeNode> {
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

function isStructField(field: any): boolean {
  return typeof field === 'object' && 'name' in field && 'type' in field;
}
