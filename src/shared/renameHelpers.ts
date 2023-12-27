import {
  EnumTypeNode,
  EnumVariantTypeNode,
  StructTypeNode,
  enumEmptyVariantTypeNode,
  enumStructVariantTypeNode,
  enumTupleVariantTypeNode,
  enumTypeNode,
  isEnumStructVariantTypeNode,
  isEnumTupleVariantTypeNode,
  structFieldTypeNode,
  structTypeNode,
} from '../nodes';

export function renameStructNode(
  node: StructTypeNode,
  map: Record<string, string>
): StructTypeNode {
  return structTypeNode(
    node.fields.map((field) =>
      map[field.name]
        ? structFieldTypeNode({ ...field, name: map[field.name] })
        : field
    )
  );
}

export function renameEnumNode(
  node: EnumTypeNode,
  map: Record<string, string>
): EnumTypeNode {
  return enumTypeNode(
    node.variants.map((variant) =>
      map[variant.name]
        ? renameEnumVariant(variant, map[variant.name])
        : variant
    ),
    { ...node }
  );
}

function renameEnumVariant(variant: EnumVariantTypeNode, newName: string) {
  if (isEnumStructVariantTypeNode(variant)) {
    return enumStructVariantTypeNode(newName, variant.struct);
  }
  if (isEnumTupleVariantTypeNode(variant)) {
    return enumTupleVariantTypeNode(newName, variant.tuple);
  }
  return enumEmptyVariantTypeNode(newName);
}
