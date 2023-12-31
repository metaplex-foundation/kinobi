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
  | (ValueNode & { strategy?: 'optional' | 'omitted' })
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
            return structFieldTypeNode({
              ...field,
              defaultsTo: !defaultValue
                ? null
                : {
                    strategy: defaultValue.strategy ?? 'optional',
                    value: defaultValue,
                  },
            });
          });
          return structTypeNode(fields);
        },
      })
    )
  );
}
