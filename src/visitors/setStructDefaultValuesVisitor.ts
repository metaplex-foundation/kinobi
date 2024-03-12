import {
  InstructionArgumentNode,
  StructFieldTypeNode,
  ValueNode,
  assertIsNode,
  instructionArgumentNode,
  instructionNode,
  isNode,
  structFieldTypeNode,
  structTypeNode,
} from '../nodes';
import { getNodeSelectorFunction, mainCase } from '../shared';
import {
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';

type StructDefaultValueMap = Record<string, Record<string, StructDefaultValue>>;
type StructDefaultValue =
  | ValueNode
  | { value: ValueNode; strategy?: 'optional' | 'omitted' }
  | null;

export function setStructDefaultValuesVisitor(map: StructDefaultValueMap) {
  return bottomUpTransformerVisitor(
    Object.entries(map).flatMap(
      ([stack, defaultValues]): BottomUpNodeTransformerWithSelector[] => {
        const mainCasedDefaultValues = Object.fromEntries(
          Object.entries(defaultValues).map(([key, value]) => [
            mainCase(key),
            value,
          ])
        );

        return [
          {
            select: `${stack}.[structTypeNode]`,
            transform: (node) => {
              assertIsNode(node, 'structTypeNode');
              const fields = node.fields.map((field): StructFieldTypeNode => {
                const defaultValue = mainCasedDefaultValues[field.name];
                if (defaultValue === undefined) return field;
                if (defaultValue === null) {
                  return structFieldTypeNode({
                    ...field,
                    defaultValue: undefined,
                    defaultValueStrategy: undefined,
                  });
                }
                return structFieldTypeNode({
                  ...field,
                  defaultValue:
                    'kind' in defaultValue ? defaultValue : defaultValue.value,
                  defaultValueStrategy:
                    'kind' in defaultValue ? undefined : defaultValue.strategy,
                });
              });
              return structTypeNode(fields);
            },
          },
          {
            select: (node, nodeStack): boolean =>
              getNodeSelectorFunction(stack)(node, nodeStack) &&
              isNode(node, 'instructionNode'),
            transform: (node) => {
              assertIsNode(node, 'instructionNode');
              const transformArguments = (
                arg: InstructionArgumentNode
              ): InstructionArgumentNode => {
                const defaultValue = mainCasedDefaultValues[arg.name];
                if (defaultValue === undefined) return arg;
                if (defaultValue === null) {
                  return instructionArgumentNode({
                    ...arg,
                    defaultValue: undefined,
                    defaultValueStrategy: undefined,
                  });
                }
                return instructionArgumentNode({
                  ...arg,
                  defaultValue:
                    'kind' in defaultValue ? defaultValue : defaultValue.value,
                  defaultValueStrategy:
                    'kind' in defaultValue ? undefined : defaultValue.strategy,
                });
              };
              return instructionNode({
                ...node,
                arguments: node.arguments.map(transformArguments),
                extraArguments: node.extraArguments
                  ? node.extraArguments.map(transformArguments)
                  : undefined,
              });
            },
          },
        ];
      }
    )
  );
}
