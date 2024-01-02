import {
  DefinedTypeNodeInput,
  assertIsNode,
  definedTypeLinkNode,
  definedTypeNode,
  isNode,
} from '../nodes';
import { mainCase, renameEnumNode, renameStructNode } from '../shared';
import {
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';

export type DefinedTypeUpdates =
  | { delete: true }
  | (Partial<Omit<DefinedTypeNodeInput, 'data'>> & {
      data?: Record<string, string>;
    });

export function updateDefinedTypesVisitor(
  map: Record<string, DefinedTypeUpdates>
) {
  return bottomUpTransformerVisitor(
    Object.entries(map).flatMap(
      ([selector, updates]): BottomUpNodeTransformerWithSelector[] => {
        const selectorStack = selector.split('.');
        const name = selectorStack.pop();
        const newName =
          typeof updates === 'object' && 'name' in updates && updates.name
            ? mainCase(updates.name)
            : undefined;

        const transformers: BottomUpNodeTransformerWithSelector[] = [
          {
            select: `${selectorStack.join('.')}.[definedTypeNode]${name}`,
            transform: (node) => {
              assertIsNode(node, 'definedTypeNode');
              if ('delete' in updates) {
                return null;
              }
              const { data: dataUpdates, ...otherUpdates } = updates;
              let newType = node.type;
              if (isNode(node.type, 'structTypeNode')) {
                newType = renameStructNode(node.type, dataUpdates ?? {});
              } else if (isNode(node.type, 'enumTypeNode')) {
                newType = renameEnumNode(node.type, dataUpdates ?? {});
              }
              return definedTypeNode({
                ...node,
                ...otherUpdates,
                name: newName ?? node.name,
                type: newType,
              });
            },
          },
        ];

        if (newName) {
          transformers.push({
            select: `${selectorStack.join('.')}.[definedTypeLinkNode]${name}`,
            transform: (node) => {
              assertIsNode(node, 'definedTypeLinkNode');
              if (node.importFrom) return node;
              return definedTypeLinkNode(newName);
            },
          });
        }

        return transformers;
      }
    )
  );
}
