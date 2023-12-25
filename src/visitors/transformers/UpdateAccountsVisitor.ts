import * as nodes from '../../nodes';
import { mainCase } from '../../shared';
import { BottomUpNodeTransformer } from '../bottomUpTransformerVisitor';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';
import { renameStructNode } from './_renameHelpers';

export type AccountUpdates =
  | BottomUpNodeTransformer<nodes.AccountNode>
  | { delete: true }
  | (Partial<Omit<nodes.AccountNodeInput, 'data'>> & {
      data?: Record<string, string>;
    });

export class UpdateAccountsVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, AccountUpdates>) {
    const transforms = Object.entries(map).map(
      ([selector, updates]): NodeTransform => {
        const selectorStack = selector.split('.');
        const name = selectorStack.pop();
        return {
          selector: `${selectorStack.join('.')}.[accountNode]${name}`,
          transformer: (node, stack) => {
            nodes.assertAccountNode(node);
            if (typeof updates === 'function') {
              return updates(node, stack);
            }
            if ('delete' in updates) {
              return null;
            }

            const newName = mainCase(updates.name ?? node.name);
            return nodes.accountNode({
              ...node,
              ...updates,
              data: nodes.accountDataNode({
                ...node.data,
                name: `${newName}AccountData`,
                struct: renameStructNode(node.data.struct, updates.data ?? {}),
              }),
            });
          },
        };
      }
    );

    super(transforms);
  }
}
