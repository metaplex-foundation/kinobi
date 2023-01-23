import * as nodes from '../../nodes';
import {
  NodeTransform,
  NodeTransformer,
  TransformNodesVisitor,
} from './TransformNodesVisitor';

export type ErrorUpdates =
  | NodeTransformer<nodes.ErrorNode>
  | { delete: true }
  | (Partial<nodes.ErrorNodeMetadata> & {
      code?: nodes.ErrorNode['code'];
      message?: nodes.ErrorNode['message'];
    });

export class UpdateErrorsVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, ErrorUpdates>) {
    const transforms = Object.entries(map).map(
      ([name, updates]): NodeTransform => ({
        selector: { type: 'error', name },
        transformer: (node, stack, Error) => {
          nodes.assertErrorNode(node);
          if (typeof updates === 'function') {
            return updates(node, stack, Error);
          }
          if ('delete' in updates) {
            return null;
          }
          const { code, message, ...metadata } = updates;
          return new nodes.ErrorNode(
            { ...node.metadata, ...metadata },
            code ?? node.code,
            message ?? node.message
          );
        },
      })
    );

    super(transforms);
  }
}
