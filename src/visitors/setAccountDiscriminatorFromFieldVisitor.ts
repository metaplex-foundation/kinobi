import { fieldAccountDiscriminator } from '../shared';
import {
  ValueNode,
  accountNode,
  assertIsNode,
  structFieldTypeNode,
  structTypeNode,
} from '../nodes';
import {
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';

export function setAccountDiscriminatorFromFieldVisitor(
  map: Record<string, { field: string; value: ValueNode }>
) {
  return bottomUpTransformerVisitor(
    Object.entries(map).map(
      ([
        selectorStack,
        { field, value },
      ]): BottomUpNodeTransformerWithSelector => {
        const stack = selectorStack.split('.');
        const name = stack.pop();
        return {
          select: `${stack.join('.')}.[accountNode]${name}`,
          transform: (node) => {
            assertIsNode(node, 'accountNode');

            const fieldIndex = node.data.fields.findIndex(
              (f) => f.name === field
            );
            if (fieldIndex < 0) {
              throw new Error(
                `Account [${node.name}] does not have a field named [${field}].`
              );
            }

            const fieldNode = node.data.fields[fieldIndex];
            return accountNode({
              ...node,
              discriminator: fieldAccountDiscriminator(field),
              data: structTypeNode([
                ...node.data.fields.slice(0, fieldIndex),
                structFieldTypeNode({
                  ...fieldNode,
                  defaultValue: value,
                  defaultValueStrategy: 'omitted',
                }),
                ...node.data.fields.slice(fieldIndex + 1),
              ]),
            });
          },
        };
      }
    )
  );
}
