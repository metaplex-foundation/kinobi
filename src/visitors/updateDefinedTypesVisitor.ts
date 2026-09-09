import {
  DefinedTypeLinkNode,
  DefinedTypeNode,
  DefinedTypeNodeInput,
  assertIsNode,
  definedTypeLinkNode,
  definedTypeNode,
  isNode,
} from '../nodes';
import {
  NodeSelector,
  mainCase,
  renameEnumNode,
  renameStructNode,
} from '../shared';
import {
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';

export type DefinedTypeUpdates =
  | { delete: true }
  | (Partial<Omit<DefinedTypeNodeInput, 'data'>> & {
      data?: Record<string, string>;
    });

/**
 * Either a static set of updates, or a function computing them per node.
 * The function receives the matched `definedTypeNode`, and — when the
 * updates rename the type — every matched `definedTypeLinkNode` so the
 * links can follow the rename. Only `name` is honoured for link nodes.
 */
export type DefinedTypeUpdater =
  | DefinedTypeUpdates
  | ((node: DefinedTypeNode | DefinedTypeLinkNode) => DefinedTypeUpdates);

export type DefinedTypeUpdateWithSelector = {
  select: NodeSelector | NodeSelector[];
  update: DefinedTypeUpdater;
};

export function updateDefinedTypesVisitor(
  map: Record<string, DefinedTypeUpdates> | DefinedTypeUpdateWithSelector[]
) {
  const entries: DefinedTypeUpdateWithSelector[] = Array.isArray(map)
    ? map
    : Object.entries(map).map(([select, update]) => ({ select, update }));

  return bottomUpTransformerVisitor(
    entries.flatMap(
      ({ select, update }): BottomUpNodeTransformerWithSelector[] => {
        const selectors = Array.isArray(select) ? select : [select];
        const resolve = (node: DefinedTypeNode | DefinedTypeLinkNode) =>
          typeof update === 'function' ? update(node) : update;
        const newNameFor = (node: DefinedTypeNode | DefinedTypeLinkNode) => {
          const updates = resolve(node);
          return 'name' in updates && updates.name
            ? mainCase(updates.name)
            : undefined;
        };

        return [
          {
            select: ['[definedTypeNode]', ...selectors],
            transform: (node) => {
              assertIsNode(node, 'definedTypeNode');
              const updates = resolve(node);
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
                name: newNameFor(node) ?? node.name,
                type: newType,
              });
            },
          },
          {
            select: ['[definedTypeLinkNode]', ...selectors],
            transform: (node) => {
              assertIsNode(node, 'definedTypeLinkNode');
              if (node.importFrom) return node;
              const newName = newNameFor(node);
              return newName ? definedTypeLinkNode(newName) : node;
            },
          },
        ];
      }
    )
  );
}
