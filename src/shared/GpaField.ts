import {
  isNode,
  type AccountNode,
  type DefinedTypeLinkNode,
  type DefinedTypeNode,
  type RegisteredTypeNodeKind,
  type StructFieldTypeNode,
  type StructTypeNode,
  type TypeNode,
} from '../nodes';
import { Visitor, visit } from '../visitors';
import { LinkableDictionary } from './LinkableDictionary';

export type GpaField = {
  name: string;
  offset: number | null;
  type: TypeNode;
};

export type NestedGpaField = {
  parentFieldName: string;
  parentOffset: number | null;
  structTypeName: string;
  fields: Array<{
    name: string;
    type: TypeNode;
  }>;
};

export function getGpaFieldsFromAccount(
  node: AccountNode,
  sizeVisitor: Visitor<
    number | null,
    RegisteredTypeNodeKind | 'definedTypeLinkNode'
  >
): GpaField[] {
  let offset: number | null = 0;
  return node.data.fields.map((field): GpaField => {
    const fieldOffset = offset;
    if (offset !== null) {
      const newOffset = visit(field.type, sizeVisitor);
      offset = newOffset !== null ? offset + newOffset : null;
    }
    return { name: field.name, offset: fieldOffset, type: field.type };
  });
}

/**
 * Extracts nested struct fields from GPA fields for generating
 * registerNestedFieldsFromStruct calls.
 */
export function getNestedGpaFieldsFromAccount(
  gpaFields: GpaField[],
  linkables: LinkableDictionary
): NestedGpaField[] {
  return gpaFields
    .filter(
      (gpaField): gpaField is GpaField & { type: DefinedTypeLinkNode } =>
        isNode(gpaField.type, 'definedTypeLinkNode') &&
        !gpaField.type.importFrom
    )
    .reduce<NestedGpaField[]>((acc, gpaField) => {
      const definedType = linkables.get(gpaField.type) as
        | DefinedTypeNode
        | undefined;
      if (!definedType || !isNode(definedType.type, 'structTypeNode')) {
        return acc;
      }
      const structType = definedType.type as StructTypeNode;
      acc.push({
        parentFieldName: gpaField.name,
        parentOffset: gpaField.offset,
        structTypeName: definedType.name,
        fields: structType.fields.map((field: StructFieldTypeNode) => ({
          name: field.name,
          type: field.type,
        })),
      });
      return acc;
    }, []);
}
