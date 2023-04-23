import { logWarn } from '../../shared/logs';
import * as nodes from '../../nodes';
import { camelCase } from '../../shared';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

export type FlattenStructOptions = string[] | '*';

export class FlattenStructVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, FlattenStructOptions>) {
    const transforms = Object.entries(map).map(
      ([stack, options]): NodeTransform => ({
        selector: { kind: 'structTypeNode', stack },
        transformer: (node) => flattenStruct(node, options),
      })
    );

    super(transforms);
  }
}

export const flattenStruct = (
  node: nodes.Node,
  options: FlattenStructOptions = '*'
): nodes.StructTypeNode => {
  nodes.assertStructTypeNode(node);
  const camelCaseOptions = options === '*' ? options : options.map(camelCase);
  const shouldInline = (field: nodes.StructFieldTypeNode): boolean =>
    options === '*' || camelCaseOptions.includes(camelCase(field.name));
  const inlinedFields = node.fields.reduce<nodes.StructFieldTypeNode[]>(
    (all, one) => {
      if (nodes.isStructTypeNode(one.child) && shouldInline(one)) {
        all.push(...one.child.fields);
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

  return hasConflictingNames ? node : nodes.structTypeNode(inlinedFields);
};
