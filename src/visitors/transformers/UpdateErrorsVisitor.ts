import * as nodes from '../../nodes';
import {
  NodeTransform,
  NodeTransformer,
  TransformNodesVisitor,
} from './TransformNodesVisitor';

export type ErrorUpdates =
  | NodeTransformer<nodes.ErrorNode>
  | { delete: true }
  | Partial<nodes.ErrorNodeInput>;

export class UpdateErrorsVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, ErrorUpdates>) {
    const transforms = Object.entries(map).map(
      ([name, updates]): NodeTransform => ({
        selector: { kind: 'errorNode', name },
        transformer: (node, stack, program) => {
          nodes.assertErrorNode(node);
          if (typeof updates === 'function') {
            return updates(node, stack, program);
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
