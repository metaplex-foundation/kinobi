import * as nodes from '../../nodes';
import { mainCase } from '../../utils';
import {
  NodeTransform,
  NodeTransformer,
  TransformNodesVisitor,
} from './TransformNodesVisitor';
import { renameEnumNode, renameStructNode } from './_renameHelpers';

export type DefinedTypeUpdates =
  | NodeTransformer<nodes.DefinedTypeNode>
  | { delete: true }
  | (Partial<nodes.DefinedTypeNodeMetadata> & {
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
            selector: { type: 'DefinedTypeNode', stack: selectorStack, name },
            transformer: (node, stack, program) => {
              nodes.assertDefinedTypeNode(node);
              if (typeof updates === 'function') {
                return updates(node, stack, program);
              }
              if ('delete' in updates) {
                return null;
              }
              let newType = node.type;
              if (nodes.isStructTypeNode(node.type)) {
                newType = renameStructNode(
                  node.type,
                  updates.data ?? {},
                  newName ?? node.name
                );
              } else if (nodes.isEnumTypeNode(node.type)) {
                newType = renameEnumNode(
                  node.type,
                  updates.data ?? {},
                  newName ?? node.name
                );
              }
              return new nodes.DefinedTypeNode(
                { ...node.metadata, ...updates },
                newType
              );
            },
          },
        ];

        if (newName) {
          transforms.push({
            selector: {
              type: 'LinkTypeNode',
              stack: selectorStack,
              name,
            },
            transformer: (node: nodes.Node) => {
              nodes.assertLinkTypeNode(node);
              if (node.importFrom !== 'generated') return node;
              return new nodes.LinkTypeNode(newName, { ...node });
            },
          });
        }

        return transforms;
      })
    );
  }
}
