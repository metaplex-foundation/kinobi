import {
  ValueNode,
  accountNode,
  assertIsNode,
  fieldDiscriminatorNode,
  resolveNestedTypeNode,
  structFieldTypeNode,
  structTypeNode,
  transformNestedTypeNode,
} from '../nodes';
import {
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';

export function setAccountDiscriminatorFromFieldVisitor(
  map: Record<string, { field: string; value: ValueNode; offset?: number }>
) {
  return bottomUpTransformerVisitor(
    Object.entries(map).map(
      ([
        selector,
        { field, value, offset },
      ]): BottomUpNodeTransformerWithSelector => ({
        select: ['[accountNode]', selector],
        transform: (node) => {
          assertIsNode(node, 'accountNode');

          const accountData = resolveNestedTypeNode(node.data);
          const fieldIndex = accountData.fields.findIndex(
            (f) => f.name === field
          );
          if (fieldIndex < 0) {
            throw new Error(
              `Account [${node.name}] does not have a field named [${field}].`
            );
          }

          const fieldNode = accountData.fields[fieldIndex];
          return accountNode({
            ...node,
            discriminators: [
              fieldDiscriminatorNode(field, offset),
              ...(node.discriminators ?? []),
            ],
            data: transformNestedTypeNode(node.data, () =>
              structTypeNode([
                ...accountData.fields.slice(0, fieldIndex),
                structFieldTypeNode({
                  ...fieldNode,
                  defaultValue: value,
                  defaultValueStrategy: 'omitted',
                }),
                ...accountData.fields.slice(fieldIndex + 1),
              ])
            ),
          });
        },
      })
    )
  );
}
