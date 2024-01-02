import type { AccountNode, RegisteredTypeNodeKind, TypeNode } from '../nodes';
import { Visitor, visit } from '../visitors';

export type GpaField = {
  name: string;
  offset: number | null;
  type: TypeNode;
};

export function getGpaFieldsFromAccount(
  node: AccountNode,
  sizeVisitor: Visitor<
    number | null,
    RegisteredTypeNodeKind | 'definedTypeLinkNode'
  >
): GpaField[] {
  let offset: number | null = 0;
  return node.data.struct.fields.map((field): GpaField => {
    const fieldOffset = offset;
    if (offset !== null) {
      const newOffset = visit(field.type, sizeVisitor);
      offset = newOffset !== null ? offset + newOffset : null;
    }
    return { name: field.name, offset: fieldOffset, type: field.type };
  });
}
