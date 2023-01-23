import * as nodes from '../../nodes';

export function renameStructNode(
  node: nodes.TypeStructNode,
  map: Record<string, string>,
  newName?: string
): nodes.TypeStructNode {
  return new nodes.TypeStructNode(
    newName ?? node.name,
    node.fields.map((field) =>
      map[field.name]
        ? new nodes.TypeStructFieldNode(
            { ...field.metadata, name: map[field.name] },
            field.type
          )
        : field
    )
  );
}

export function renameEnumNode(
  node: nodes.TypeEnumNode,
  map: Record<string, string>,
  newName?: string
): nodes.TypeEnumNode {
  return new nodes.TypeEnumNode(
    newName ?? node.name,
    node.variants.map((variant) =>
      map[variant.name]
        ? renameEnumVariant(variant, map[variant.name])
        : variant
    )
  );
}

function renameEnumVariant(
  variant: nodes.TypeEnumVariantNode,
  newName: string
) {
  if (nodes.isTypeEnumStructVariantNode(variant)) {
    return new nodes.TypeEnumStructVariantNode(newName, variant.struct);
  }
  if (nodes.isTypeEnumTupleVariantNode(variant)) {
    return new nodes.TypeEnumTupleVariantNode(newName, variant.tuple);
  }
  return new nodes.TypeEnumEmptyVariantNode(newName);
}
