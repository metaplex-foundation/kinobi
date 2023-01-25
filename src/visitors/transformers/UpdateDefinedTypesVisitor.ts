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
            selector: { type: 'definedType', stack: selectorStack, name },
            transformer: (node, stack, program) => {
              nodes.assertDefinedTypeNode(node);
              if (typeof updates === 'function') {
                return updates(node, stack, program);
              }
              if ('delete' in updates) {
                return null;
              }
              return new nodes.DefinedTypeNode(
                { ...node.metadata, ...updates },
                nodes.isTypeStructNode(node.type)
                  ? renameStructNode(
                      node.type,
                      updates.data ?? {},
                      newName ?? node.name
                    )
                  : renameEnumNode(
                      node.type,
                      updates.data ?? {},
                      newName ?? node.name
                    )
              );
            },
          },
        ];

        if (newName) {
          transforms.push({
            selector: { type: 'typeDefinedLink', stack: selectorStack, name },
            transformer: (node: nodes.Node) => {
              nodes.assertTypeDefinedLinkNode(node);
              return new nodes.TypeDefinedLinkNode(newName, node.dependency);
            },
          });
        }

        return transforms;
      })
    );
  }
}
