import {
  AccountNode,
  AccountNodeInput,
  accountDataNode,
  accountNode,
  assertAccountNode,
} from '../nodes';
import { mainCase, renameStructNode } from '../shared';
import {
  BottomUpNodeTransformer,
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';

export type AccountUpdates =
  | BottomUpNodeTransformer<AccountNode>
  | { delete: true }
  | (Partial<Omit<AccountNodeInput, 'data'>> & {
      data?: Record<string, string>;
    });

export function updateAccountsVisitor(map: Record<string, AccountUpdates>) {
  return bottomUpTransformerVisitor(
    Object.entries(map).map(
      ([selector, updates]): BottomUpNodeTransformerWithSelector => {
        const selectorStack = selector.split('.');
        const name = selectorStack.pop();
        return {
          select: `${selectorStack.join('.')}.[accountNode]${name}`,
          transform: (node, stack) => {
            assertAccountNode(node);
            if (typeof updates === 'function') {
              return updates(node, stack);
            }
            if ('delete' in updates) {
              return null;
            }

            const newName = mainCase(updates.name ?? node.name);
            return accountNode({
              ...node,
              ...updates,
              data: accountDataNode({
                ...node.data,
                name: `${newName}AccountData`,
                struct: renameStructNode(node.data.struct, updates.data ?? {}),
              }),
            });
          },
        };
      }
    )
  );
}
