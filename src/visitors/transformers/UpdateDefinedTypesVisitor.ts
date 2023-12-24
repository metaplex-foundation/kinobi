import * as nodes from '../../nodes';
import { mainCase } from '../../shared';
import { NodeTransformer } from '../transformerVisitor';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';
import { renameEnumNode, renameStructNode } from './_renameHelpers';

export type DefinedTypeUpdates =
  | NodeTransformer<nodes.DefinedTypeNode>
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
            selector: { kind: 'definedTypeNode', stack: selectorStack, name },
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
            selector: {
              kind: 'linkTypeNode',
              stack: selectorStack,
              name,
            },
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
