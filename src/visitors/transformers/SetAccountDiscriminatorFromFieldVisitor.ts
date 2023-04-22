import { fieldAccountDiscriminator } from '../../shared';
import * as nodes from '../../nodes';
import { ValueNode } from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

export class SetAccountDiscriminatorFromFieldVisitor extends TransformNodesVisitor {
  constructor(
    readonly map: Record<string, { field: string; value: ValueNode }>
  ) {
    const transforms = Object.entries(map).map(
      ([selectorStack, { field, value }]): NodeTransform => {
        const stack = selectorStack.split('.');
        const name = stack.pop();
        return {
          selector: { kind: 'accountNode', stack, name },
          transformer: (node) => {
            nodes.assertAccountNode(node);

            const fieldIndex = node.data.struct.fields.findIndex(
              (f) => f.name === field
            );
            if (fieldIndex < 0) {
              throw new Error(
                `Account [${node.name}] does not have a field named [${field}].`
              );
            }

            const fieldNode = node.data.struct.fields[fieldIndex];
            return nodes.accountNode({
              ...node,
              discriminator: fieldAccountDiscriminator(field),
              data: nodes.accountDataNode(
                nodes.structTypeNode(node.data.struct.name, [
                  ...node.data.struct.fields.slice(0, fieldIndex),
                  nodes.structFieldTypeNode({
                    ...fieldNode,
                    defaultsTo: { strategy: 'omitted', value },
                  }),
                  ...node.data.struct.fields.slice(fieldIndex + 1),
                ]),
                node.data.link
              ),
            });
          },
        };
      }
    );

    super(transforms);
  }
}
