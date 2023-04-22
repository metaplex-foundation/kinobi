import * as nodes from '../../nodes';

export function renameStructNode(
  node: nodes.StructTypeNode,
  map: Record<string, string>,
  newName?: string
): nodes.StructTypeNode {
  return nodes.structTypeNode(
    newName ?? node.name,
    node.fields.map((field) =>
      map[field.name]
        ? nodes.structFieldTypeNode(
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
  return nodes.enumTypeNode(
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
    return nodes.enumStructVariantTypeNode(newName, variant.struct);
  }
  if (nodes.isEnumTupleVariantTypeNode(variant)) {
    return nodes.enumTupleVariantTypeNode(newName, variant.tuple);
  }
  return nodes.enumEmptyVariantTypeNode(newName);
}
