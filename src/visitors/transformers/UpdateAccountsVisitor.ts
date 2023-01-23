import * as nodes from '../../nodes';
import {
  NodeTransform,
  NodeTransformer,
  TransformNodesVisitor,
} from './TransformNodesVisitor';

export type AccountUpdates =
  | NodeTransformer<nodes.AccountNode>
  | { delete: true }
  | Partial<nodes.AccountNodeMetadata>;

export class UpdateAccountsVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, AccountUpdates>) {
    const transforms = Object.entries(map).map(
      ([name, updates]): NodeTransform => ({
        selector: { type: 'account', name },
        transformer: (node, stack, Account) => {
          nodes.assertAccountNode(node);
          if (typeof updates === 'function') {
            return updates(node, stack, Account);
          }
          if ('delete' in updates) {
            return null;
          }
          return new nodes.AccountNode(
            { ...node.metadata, ...updates },
            node.type
          );
        },
      })
    );

    super(transforms);
  }
}
