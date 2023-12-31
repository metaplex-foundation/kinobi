import type { Mutable } from '../../shared';
import type { EnumEmptyVariantTypeNode } from './EnumEmptyVariantTypeNode';
import type { EnumStructVariantTypeNode } from './EnumStructVariantTypeNode';
import type { EnumTupleVariantTypeNode } from './EnumTupleVariantTypeNode';

export type EnumVariantTypeNode =
  | EnumEmptyVariantTypeNode
  | EnumStructVariantTypeNode
  | EnumTupleVariantTypeNode;

const ENUM_VARIANT_TYPE_NODES_INTERNAL = [
  'enumEmptyVariantTypeNode',
  'enumStructVariantTypeNode',
  'enumTupleVariantTypeNode',
] as const;

export const ENUM_VARIANT_TYPE_NODES =
  ENUM_VARIANT_TYPE_NODES_INTERNAL as Mutable<
    typeof ENUM_VARIANT_TYPE_NODES_INTERNAL
  >;
