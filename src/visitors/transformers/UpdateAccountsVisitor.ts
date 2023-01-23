import * as nodes from '../../nodes';
import {
  NodeTransform,
  NodeTransformer,
  TransformNodesVisitor,
} from './TransformNodesVisitor';
import { StructUpdates, updateStructNode } from './_updateHelpers';

export type AccountUpdates =
  | NodeTransformer<nodes.AccountNode>
  | { delete: true }
  | (Partial<nodes.AccountNodeMetadata> & {
      data?: StructUpdates;
    });

export class UpdateAccountsVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, AccountUpdates>) {
    const transforms = Object.entries(map).map(
      ([name, updates]): NodeTransform => ({
        selector: { type: 'account', name },
        transformer: (node, stack, program) => {
          nodes.assertAccountNode(node);
          if (typeof updates === 'function') {
            return updates(node, stack, program);
          }
          if ('delete' in updates) {
            return null;
          }
          return new nodes.AccountNode(
            { ...node.metadata, ...updates },
            updateStructNode(updates.data ?? {}, node.type, stack, program)
          );
        },
      })
    );

    super(transforms);
  }
}
