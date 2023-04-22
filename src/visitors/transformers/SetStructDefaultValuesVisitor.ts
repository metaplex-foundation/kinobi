import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

type StructDefaultValueMap = Record<string, Record<string, StructDefaultValue>>;
type StructDefaultValue =
  | (nodes.ValueNode & { strategy?: 'optional' | 'omitted' })
  | null;

export class SetStructDefaultValuesVisitor extends TransformNodesVisitor {
  constructor(readonly map: StructDefaultValueMap) {
    const transforms = Object.entries(map).map(
      ([selectorStack, defaultValues]): NodeTransform => {
        const stack = selectorStack.split('.');
        const name = stack.pop();
        return {
          selector: { type: 'StructTypeNode', stack, name },
          transformer: (node) => {
            nodes.assertStructTypeNode(node);
            const fields = node.fields.map(
              (field): nodes.StructFieldTypeNode => {
                const defaultValue = defaultValues[field.name];
                if (defaultValue === undefined) return field;
                return nodes.structFieldTypeNode(
                  {
                    ...field.metadata,
                    defaultsTo: !defaultValue
                      ? null
                      : {
                          strategy: defaultValue.strategy ?? 'optional',
                          value: defaultValue,
                        },
                  },
                  field.type
                );
              }
            );
            return nodes.structTypeNode(node.name, fields);
          },
        };
      }
    );

    super(transforms);
  }
}
