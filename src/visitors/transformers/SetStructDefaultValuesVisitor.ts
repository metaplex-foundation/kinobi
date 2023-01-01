import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

type StructDefaultValue =
  | number
  | { value: any }
  | nodes.TypeStructNodeFieldDefaults;
type StructDefaultValueMap = Record<string, Record<string, StructDefaultValue>>;

// const bar: StructDefaultValueMap = {
//   'mplTokenMetadata.Create.Foo': {
//     field1: 42,
//     field2: { value: 42 },
//     field3: { value: 42, strategy: 'optional' },
//     field4: { value: 42, strategy: 'omitted' },
//   },
// };

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
          return matchStackWithNames(stack, selectorStack);
        },
        transformer: (node) => {
          console.log(node, defaultValues);
          return node;
        },
      })
    );

    super(transforms);
  }
}

function matchStackWithNames(stack: nodes.Node[], names: string[]): boolean {
  stack.forEach((node) => {
    const nodeName = (node as { name?: string }).name;
    if (nodeName && names.length > 0 && names[0] === nodeName) {
      names.shift();
    }
  });

  return names.length === 0;
}
