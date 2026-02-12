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
  fields: Array<{
    name: string;
    offset: number | null;
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
 * Extracts nested struct fields from GPA fields, computing absolute
 * offsets for each field and filtering out padding (omitted) fields.
 */
export function getNestedGpaFieldsFromAccount(
  gpaFields: GpaField[],
  linkables: LinkableDictionary,
  sizeVisitor: Visitor<
    number | null,
    RegisteredTypeNodeKind | 'definedTypeLinkNode'
  >
): NestedGpaField[] {
  return gpaFields
    .filter((gpaField) => isNode(gpaField.type, 'definedTypeLinkNode'))
    .filter((gpaField) => !(gpaField.type as DefinedTypeLinkNode).importFrom)
    .reduce((acc: NestedGpaField[], gpaField) => {
      const linkNode = gpaField.type as DefinedTypeLinkNode;
      const definedType = linkables.get(linkNode) as
        | DefinedTypeNode
        | undefined;
      if (!definedType || !isNode(definedType.type, 'structTypeNode')) {
        return acc;
      }

      const structType = definedType.type as StructTypeNode;
      let fieldOffset = gpaField.offset;

      // Walk all fields to compute offsets, but only keep non-padding fields.
      const fields = structType.fields.reduce(
        (
          fieldAcc: Array<{
            name: string;
            offset: number | null;
            type: TypeNode;
          }>,
          field: StructFieldTypeNode
        ) => {
          const currentOffset = fieldOffset;
          if (fieldOffset !== null) {
            const size = visit(field.type, sizeVisitor);
            fieldOffset = size !== null ? fieldOffset! + size : null;
          }
          if (field.defaultValueStrategy !== 'omitted') {
            fieldAcc.push({
              name: field.name,
              offset: currentOffset,
              type: field.type,
            });
          }
          return fieldAcc;
        },
        []
      );

      return [...acc, { parentFieldName: gpaField.name, fields }];
    }, []);
}
