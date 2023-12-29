import { fieldAccountDiscriminator } from '../shared';
import {
  ValueNode,
  accountDataNode,
  accountNode,
  assertAccountNode,
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
            assertAccountNode(node);

            const fieldIndex = node.data.struct.fields.findIndex(
              (f) => f.name === field
            );
            if (fieldIndex < 0) {
              throw new Error(
                `Account [${node.name}] does not have a field named [${field}].`
              );
            }

            const fieldNode = node.data.struct.fields[fieldIndex];
            return accountNode({
              ...node,
              discriminator: fieldAccountDiscriminator(field),
              data: accountDataNode({
                ...node.data,
                struct: structTypeNode([
                  ...node.data.struct.fields.slice(0, fieldIndex),
                  structFieldTypeNode({
                    ...fieldNode,
                    defaultsTo: { strategy: 'omitted', value },
                  }),
                  ...node.data.struct.fields.slice(fieldIndex + 1),
                ]),
              }),
            });
          },
        };
      }
    )
  );
}
