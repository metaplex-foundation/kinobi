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
    const transforms = Object.entries(map).map(
      ([name, updates]): NodeTransform => ({
        selector: { type: 'definedType', name },
        transformer: (node, stack, program) => {
          nodes.assertDefinedTypeNode(node);
          if (typeof updates === 'function') {
            return updates(node, stack, program);
          }
          if ('delete' in updates) {
            return null;
          }
          const newName = mainCase(updates.name ?? node.name);
          return new nodes.DefinedTypeNode(
            { ...node.metadata, ...updates },
            nodes.isTypeStructNode(node.type)
              ? renameStructNode(node.type, updates.data ?? {}, newName)
              : renameEnumNode(node.type, updates.data ?? {}, newName)
          );
        },
      })
    );

    super(transforms);
  }
}
