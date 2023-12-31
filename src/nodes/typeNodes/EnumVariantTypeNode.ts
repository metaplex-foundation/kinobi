import type { EnumEmptyVariantTypeNode } from './EnumEmptyVariantTypeNode';
import type { EnumStructVariantTypeNode } from './EnumStructVariantTypeNode';
import type { EnumTupleVariantTypeNode } from './EnumTupleVariantTypeNode';

export type EnumVariantTypeNode =
  | EnumEmptyVariantTypeNode
  | EnumStructVariantTypeNode
  | EnumTupleVariantTypeNode;

export const ENUM_VARIANT_TYPE_NODES = [
  'enumEmptyVariantTypeNode',
  'enumStructVariantTypeNode',
  'enumTupleVariantTypeNode',
] as [
  'enumEmptyVariantTypeNode',
  'enumStructVariantTypeNode',
  'enumTupleVariantTypeNode'
];
