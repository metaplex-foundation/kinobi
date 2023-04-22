import * as nodes from '../../nodes';

export function renameStructNode(
  node: nodes.StructTypeNode,
  map: Record<string, string>,
  newName?: string
): nodes.StructTypeNode {
  return new nodes.StructTypeNode(
    newName ?? node.name,
    node.fields.map((field) =>
      map[field.name]
        ? new nodes.StructFieldTypeNode(
            { ...field.metadata, name: map[field.name] },
            field.type
          )
        : field
    )
  );
}

export function renameEnumNode(
  node: nodes.EnumTypeNode,
  map: Record<string, string>,
  newName?: string
): nodes.EnumTypeNode {
  return new nodes.EnumTypeNode(
    newName ?? node.name,
    node.variants.map((variant) =>
      map[variant.name]
        ? renameEnumVariant(variant, map[variant.name])
        : variant
    )
  );
}

function renameEnumVariant(
  variant: nodes.EnumVariantTypeNode,
  newName: string
) {
  if (nodes.isEnumStructVariantTypeNode(variant)) {
    return new nodes.EnumStructVariantTypeNode(newName, variant.struct);
  }
  if (nodes.isEnumTupleVariantTypeNode(variant)) {
    return new nodes.EnumTupleVariantTypeNode(newName, variant.tuple);
  }
  return new nodes.EnumEmptyVariantTypeNode(newName);
}
