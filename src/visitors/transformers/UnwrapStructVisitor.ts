import * as nodes from '../../nodes';
import { camelCase } from '../../utils';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

export type UnwrapStructOptions = string[] | '*';

export class UnwrapStructVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, UnwrapStructOptions>) {
    const transforms = Object.entries(map).map(
      ([selectorStack, options]): NodeTransform => {
        const stack = selectorStack.split('.');
        const name = stack.pop();
        return {
          selector: { type: 'typeStruct', stack, name },
          transformer: (node) => unwrapStruct(node, options),
        };
      }
    );

    super(transforms);
  }
}

export const unwrapStruct = (
  node: nodes.Node,
  options: UnwrapStructOptions = '*'
): nodes.TypeStructNode => {
  nodes.assertTypeStructNode(node);
  const camelCaseOptions = options === '*' ? options : options.map(camelCase);
  const shouldInline = (field: nodes.TypeStructFieldNode): boolean =>
    options === '*' || camelCaseOptions.includes(camelCase(field.name));
  const inlinedFields = node.fields.reduce<nodes.TypeStructFieldNode[]>(
    (all, one) => {
      if (nodes.isTypeStructNode(one.type) && shouldInline(one)) {
        all.push(...one.type.fields);
      } else {
        all.push(one);
      }
      return all;
    },
    []
  );

  const inlinedFieldsNames = inlinedFields.map((arg) => arg.name);
  const hasConflictingNames =
    new Set(inlinedFieldsNames).size !== inlinedFieldsNames.length;

  return hasConflictingNames
    ? node
    : new nodes.TypeStructNode(node.name, inlinedFields);
};
