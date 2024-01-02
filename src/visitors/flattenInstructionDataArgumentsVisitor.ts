import {
  InstructionArgumentNode,
  assertIsNode,
  instructionArgumentNode,
  instructionDataArgsNode,
  instructionNode,
  isNode,
} from '../nodes';
import { camelCase, logWarn } from '../shared';
import { bottomUpTransformerVisitor } from './bottomUpTransformerVisitor';

export function flattenInstructionDataArgumentsVisitor() {
  return bottomUpTransformerVisitor([
    {
      select: '[instructionNode]',
      transform: (instruction) => {
        assertIsNode(instruction, 'instructionNode');
        return instructionNode({
          ...instruction,
          dataArgs: instructionDataArgsNode({
            ...instruction.dataArgs,
            dataArguments: flattenInstructionArguments(
              instruction.dataArgs.dataArguments
            ),
          }),
        });
      },
    },
  ]);
}

export type FlattenInstructionArgumentsConfig = string[] | '*';

export const flattenInstructionArguments = (
  nodes: InstructionArgumentNode[],
  options: FlattenInstructionArgumentsConfig = '*'
): InstructionArgumentNode[] => {
  const camelCaseOptions = options === '*' ? options : options.map(camelCase);
  const shouldInline = (node: InstructionArgumentNode): boolean =>
    options === '*' || camelCaseOptions.includes(camelCase(node.name));
  const inlinedArguments = nodes.flatMap((node) => {
    if (isNode(node.type, 'structTypeNode') && shouldInline(node)) {
      return node.type.fields.map((field) =>
        instructionArgumentNode({ ...field })
      );
    }
    return node;
  });

  const inlinedFieldsNames = inlinedArguments.map((arg) => arg.name);
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

  return hasConflictingNames ? nodes : inlinedArguments;
};
