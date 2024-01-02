import {
  StructFieldTypeNode,
  ValueNode,
  assertIsNode,
  structFieldTypeNode,
  structTypeNode,
} from '../nodes';
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
    Object.entries(map).map(
      ([stack, defaultValues]): BottomUpNodeTransformerWithSelector => ({
        select: `${stack}.[structTypeNode]`,
        transform: (node) => {
          assertIsNode(node, 'structTypeNode');
          const fields = node.fields.map((field): StructFieldTypeNode => {
            const defaultValue = defaultValues[field.name];
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
      })
    )
  );
}
