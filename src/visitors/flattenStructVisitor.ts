import { logWarn } from '../shared/logs';
import {
  Node,
  StructFieldTypeNode,
  StructTypeNode,
  assertIsNode,
  isNode,
  structTypeNode,
} from '../nodes';
import { camelCase } from '../shared';
import {
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';

export type FlattenStructOptions = string[] | '*';

export function flattenStructVisitor(
  map: Record<string, FlattenStructOptions>
) {
  return bottomUpTransformerVisitor(
    Object.entries(map).map(
      ([stack, options]): BottomUpNodeTransformerWithSelector => ({
        select: `${stack}.[structTypeNode]`,
        transform: (node) => flattenStruct(node, options),
      })
    )
  );
}

export const flattenStruct = (
  node: Node,
  options: FlattenStructOptions = '*'
): StructTypeNode => {
  assertIsNode(node, 'structTypeNode');
  const camelCaseOptions = options === '*' ? options : options.map(camelCase);
  const shouldInline = (field: StructFieldTypeNode): boolean =>
    options === '*' || camelCaseOptions.includes(camelCase(field.name));
  const inlinedFields = node.fields.reduce<StructFieldTypeNode[]>(
    (all, one) => {
      if (isNode(one.type, 'structTypeNode') && shouldInline(one)) {
        all.push(...one.type.fields);
      } else {
        all.push(one);
      }
      return all;
    },
    []
  );

  const inlinedFieldsNames = inlinedFields.map((arg) => arg.name);
  const duplicates = inlinedFieldsNames.filter((e, i, a) => a.indexOf(e) !== i);
  const uniqueDuplicates = [...new Set(duplicates)];
  const hasConflictingNames = uniqueDuplicates.length > 0;

  if (hasConflictingNames) {
    logWarn(
      `Cound not flatten the attributes of a struct ` +
        `since this would cause the following attributes ` +
        `to conflict [${uniqueDuplicates.join(', ')}].` +
        'You may want to rename the conflicting attributes.'
    );
  }

  return hasConflictingNames ? node : structTypeNode(inlinedFields);
};
