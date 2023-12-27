import * as nodes from '../../nodes';
import { mainCase, renameEnumNode, renameStructNode } from '../../shared';
import { BottomUpNodeTransformer } from '../bottomUpTransformerVisitor';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

export type DefinedTypeUpdates =
  | BottomUpNodeTransformer<nodes.DefinedTypeNode>
  | { delete: true }
  | (Partial<Omit<nodes.DefinedTypeNodeInput, 'data'>> & {
      data?: Record<string, string>;
    });

export class UpdateDefinedTypesVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, DefinedTypeUpdates>) {
    super(
      Object.entries(map).flatMap(([selector, updates]): NodeTransform[] => {
        const selectorStack = selector.split('.');
        const name = selectorStack.pop();
        const newName =
          typeof updates === 'object' && 'name' in updates && updates.name
            ? mainCase(updates.name)
            : undefined;

        const transforms: NodeTransform[] = [
          {
            selector: `${selectorStack.join('.')}.[definedTypeNode]${name}`,
            transformer: (node, stack) => {
              nodes.assertDefinedTypeNode(node);
              if (typeof updates === 'function') {
                return updates(node, stack);
              }
              if ('delete' in updates) {
                return null;
              }
              const { data: dataUpdates, ...otherUpdates } = updates;
              let newData = node.data;
              if (nodes.isStructTypeNode(node.data)) {
                newData = renameStructNode(node.data, dataUpdates ?? {});
              } else if (nodes.isEnumTypeNode(node.data)) {
                newData = renameEnumNode(node.data, dataUpdates ?? {});
              }
              return nodes.definedTypeNode({
                ...node,
                ...otherUpdates,
                name: newName ?? node.name,
                data: newData,
              });
            },
          },
        ];

        if (newName) {
          transforms.push({
            selector: `${selectorStack.join('.')}.[linkTypeNode]${name}`,
            transformer: (node: nodes.Node) => {
              nodes.assertLinkTypeNode(node);
              if (node.importFrom !== 'generated') return node;
              return nodes.linkTypeNode(newName, { ...node });
            },
          });
        }

        return transforms;
      })
    );
  }
}
