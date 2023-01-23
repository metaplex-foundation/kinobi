import * as nodes from '../../nodes';
import {
  NodeTransform,
  NodeTransformer,
  TransformNodesVisitor,
} from './TransformNodesVisitor';

export type DefinedTypeUpdates =
  | NodeTransformer<nodes.DefinedTypeNode>
  | { delete: true }
  | Partial<nodes.DefinedTypeNodeMetadata>;

export class UpdateDefinedTypesVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, DefinedTypeUpdates>) {
    const transforms = Object.entries(map).map(
      ([name, updates]): NodeTransform => ({
        selector: { type: 'definedType', name },
        transformer: (node, stack, DefinedType) => {
          nodes.assertDefinedTypeNode(node);
          if (typeof updates === 'function') {
            return updates(node, stack, DefinedType);
          }
          if ('delete' in updates) {
            return null;
          }
          return new nodes.DefinedTypeNode(
            { ...node.metadata, ...updates },
            node.type
          );
        },
      })
    );

    super(transforms);
  }
}
