import { assertIsNode } from '../nodes';
import { LinkableDictionary, pipe } from '../shared';
import {
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';
import { recordLinkablesVisitor } from './recordLinkablesVisitor';

export function unwrapTypeDefinedLinksVisitor(definedLinksType: string[]) {
  const linkables = new LinkableDictionary();

  const transformers: BottomUpNodeTransformerWithSelector[] =
    definedLinksType.map((selectorStack) => {
      const stack = selectorStack.split('.');
      const name = stack.pop();
      return {
        select: `${stack.join('.')}.[definedTypeLinkNode]${name}`,
        transform: (node) => {
          assertIsNode(node, 'definedTypeLinkNode');
          if (node.importFrom) return node;
          const definedType = linkables.get(node);
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
    recordLinkablesVisitor(v, linkables)
  );
}
