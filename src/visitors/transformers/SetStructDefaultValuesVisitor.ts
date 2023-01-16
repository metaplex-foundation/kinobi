import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

type StructDefaultValue =
  | number
  | { value: any }
  | nodes.TypeStructFieldNodeDefaults;
type StructDefaultValueMap = Record<string, Record<string, StructDefaultValue>>;

export class SetStructDefaultValuesVisitor extends TransformNodesVisitor {
  constructor(readonly map: StructDefaultValueMap) {
    const transforms = Object.entries(map).map(
      ([selectorStack, defaultValues]): NodeTransform => {
        const stack = selectorStack.split('.');
        const name = stack.pop();
        return {
          selector: { type: 'typeStruct', stack, name },
          transformer: (node) => {
            nodes.assertTypeStructNode(node);
            const fields = node.fields.map(
              (field): nodes.TypeStructFieldNode => {
                const defaultValue = defaultValues[field.name];
                if (defaultValue === undefined) return field;
                const wrappedDefaultValue =
                  typeof defaultValue === 'object' && 'value' in defaultValue
                    ? defaultValue
                    : { value: defaultValue };
                return new nodes.TypeStructFieldNode(
                  {
                    ...field.metadata,
                    defaultsTo: {
                      kind: 'json',
                      strategy: 'optional',
                      ...wrappedDefaultValue,
                    },
                  },
                  field.type
                );
              }
            );
            return new nodes.TypeStructNode(node.name, fields);
          },
        };
      }
    );

    super(transforms);
  }
}
