import { DefinedTypeNode, assertLinkTypeNode } from '../nodes';
import { pipe } from '../shared';
import {
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';
import { tapDefinedTypesVisitor } from './tapVisitor';

export function unwrapTypeDefinedLinksVisitor(definedLinksType: string[]) {
  let availableDefinedTypes = new Map<string, DefinedTypeNode>();

  const transformers: BottomUpNodeTransformerWithSelector[] =
    definedLinksType.map((selectorStack) => {
      const stack = selectorStack.split('.');
      const name = stack.pop();
      return {
        select: `${stack.join('.')}.[linkTypeNode]${name}`,
        transform: (node) => {
          assertLinkTypeNode(node);
          if (node.importFrom !== 'generated') return node;
          const definedType = availableDefinedTypes.get(node.name);
          if (definedType === undefined) {
            throw new Error(
              `Trying to inline missing defined type [${node.name}]. ` +
                `Ensure this visitor starts from the root node to access all defined types.`
            );
          }
          return definedType.data;
        },
      };
    });

  return pipe(bottomUpTransformerVisitor(transformers), (v) =>
    tapDefinedTypesVisitor(v, (definedTypes) => {
      availableDefinedTypes = new Map(
        definedTypes.map((definedType) => [definedType.name, definedType])
      );
    })
  );
}
