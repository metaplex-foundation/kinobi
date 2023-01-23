import * as nodes from '../../nodes';
import { mainCase } from '../../utils';
import {
  NodeTransform,
  NodeTransformer,
  TransformNodesVisitor,
} from './TransformNodesVisitor';
import { renameStructNode } from './_renameHelpers';

export type AccountUpdates =
  | NodeTransformer<nodes.AccountNode>
  | { delete: true }
  | (Partial<nodes.AccountNodeMetadata> & {
      data?: Record<string, string>;
    });

export class UpdateAccountsVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, AccountUpdates>) {
    const transforms = Object.entries(map).map(
      ([selector, updates]): NodeTransform => {
        const selectorStack = selector.split('.');
        const name = selectorStack.pop();
        return {
          selector: { type: 'account', stack: selectorStack, name },
          transformer: (node, stack, program) => {
            nodes.assertAccountNode(node);
            if (typeof updates === 'function') {
              return updates(node, stack, program);
            }
            if ('delete' in updates) {
              return null;
            }
            const newName = mainCase(updates.name ?? node.name);
            return new nodes.AccountNode(
              { ...node.metadata, ...updates },
              renameStructNode(node.type, updates.data ?? {}, newName)
            );
          },
        };
      }
    );

    super(transforms);
  }
}
