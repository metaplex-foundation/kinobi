import * as nodes from '../../nodes';
import {
  NodeTransform,
  NodeTransformer,
  TransformNodesVisitor,
} from './TransformNodesVisitor';
import {
  EnumUpdates,
  StructUpdates,
  updateEnumNode,
  updateStructNode,
} from './_updateHelpers';

export type DefinedTypeUpdates =
  | NodeTransformer<nodes.DefinedTypeNode>
  | { delete: true }
  | (Partial<nodes.DefinedTypeNodeMetadata> & {
      data?: StructUpdates | EnumUpdates;
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
          return new nodes.DefinedTypeNode(
            { ...node.metadata, ...updates },
            nodes.isTypeStructNode(node.type)
              ? updateStructNode(
                  (updates.data ?? {}) as StructUpdates,
                  node.type,
                  stack,
                  program
                )
              : updateEnumNode(
                  (updates.data ?? {}) as EnumUpdates,
                  node.type,
                  stack,
                  program
                )
          );
        },
      })
    );

    super(transforms);
  }
}
