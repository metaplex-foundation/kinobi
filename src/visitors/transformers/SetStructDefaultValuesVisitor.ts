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
      ([selector, defaultValues]): NodeTransform => ({
        selector: (node, stack) => {
          if (!nodes.isTypeStructNode(node)) return false;
          const selectorStack = selector.split('.');
          if (selectorStack.length <= 1) return node.name === selector;
          const selectorTail = selectorStack.pop();
          if (node.name !== selectorTail) return false;
          return stack.matchesWithNames(selectorStack);
        },
        transformer: (node) => {
          nodes.assertTypeStructNode(node);
          const fields = node.fields.map((field): nodes.TypeStructFieldNode => {
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
          });
          return new nodes.TypeStructNode(node.name, fields);
        },
      })
    );

    super(transforms);
  }
}
