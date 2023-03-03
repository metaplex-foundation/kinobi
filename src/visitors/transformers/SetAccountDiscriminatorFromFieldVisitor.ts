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
          selector: { type: 'AccountNode', stack, name },
          transformer: (node) => {
            nodes.assertAccountNode(node);
            if (nodes.isTypeDefinedLinkNode(node.type)) return node;

            const fieldIndex = node.type.fields.findIndex(
              (f) => f.name === field
            );
            if (fieldIndex < 0) {
              throw new Error(
                `Account [${node.name}] does not have a field named [${field}].`
              );
            }

            const fieldNode = node.type.fields[fieldIndex];
            return new nodes.AccountNode(
              {
                ...node.metadata,
                discriminator: { kind: 'field', name: field, value: null },
              },
              new nodes.TypeStructNode(node.type.name, [
                ...node.type.fields.slice(0, fieldIndex),
                new nodes.TypeStructFieldNode(
                  {
                    ...fieldNode.metadata,
                    defaultsTo: { strategy: 'omitted', value },
                  },
                  fieldNode.type
                ),
                ...node.type.fields.slice(fieldIndex + 1),
              ])
            );
          },
        };
      }
    );

    super(transforms);
  }
}
