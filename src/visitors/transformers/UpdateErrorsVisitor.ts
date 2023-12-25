import * as nodes from '../../nodes';
import { BottomUpNodeTransformer } from '../bottomUpTransformerVisitor';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

export type ErrorUpdates =
  | BottomUpNodeTransformer<nodes.ErrorNode>
  | { delete: true }
  | Partial<nodes.ErrorNodeInput>;

export class UpdateErrorsVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, ErrorUpdates>) {
    const transforms = Object.entries(map).map(
      ([name, updates]): NodeTransform => ({
        selector: `[errorNode]${name}`,
        transformer: (node, stack) => {
          nodes.assertErrorNode(node);
          if (typeof updates === 'function') {
            return updates(node, stack);
          }
          if ('delete' in updates) {
            return null;
          }
          return nodes.errorNode({ ...node, ...updates });
        },
      })
    );

    super(transforms);
  }
}
