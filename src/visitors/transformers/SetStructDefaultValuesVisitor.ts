import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

type StructDefaultValueMap = Record<string, Record<string, StructDefaultValue>>;
type StructDefaultValue = {
  strategy?: 'optional' | 'omitted';
  value: nodes.ValueNode;
} | null;

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
                return new nodes.TypeStructFieldNode(
                  {
                    ...field.metadata,
                    defaultsTo: !defaultValue
                      ? null
                      : { strategy: 'optional' as const, ...defaultValue },
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
