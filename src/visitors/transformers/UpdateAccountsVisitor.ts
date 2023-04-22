import * as nodes from '../../nodes';
import { AccountNodeMetadata } from '../../nodes';
import { mainCase } from '../../shared';
import {
  NodeTransform,
  NodeTransformer,
  TransformNodesVisitor,
} from './TransformNodesVisitor';
import { renameStructNode } from './_renameHelpers';

export type AccountUpdates =
  | NodeTransformer<nodes.AccountNode>
  | { delete: true }
  | (Partial<nodes.AccountNodeMetadata> & { data?: Record<string, string> });

export class UpdateAccountsVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, AccountUpdates>) {
    const transforms = Object.entries(map).map(
      ([selector, updates]): NodeTransform => {
        const selectorStack = selector.split('.');
        const name = selectorStack.pop();
        return {
          selector: { type: 'AccountNode', stack: selectorStack, name },
          transformer: (node, stack, program) => {
            nodes.assertAccountNode(node);
            if (typeof updates === 'function') {
              return updates(node, stack, program);
            }
            if ('delete' in updates) {
              return null;
            }

            const newName = mainCase(updates.name ?? node.name);
            const data = updates.data ?? {};
            const newGpaFields: nodes.AccountNodeGpaField[] =
              node.metadata.gpaFields.map((f) => ({
                ...f,
                name: data[f.name] ?? f.name,
              }));
            const newMetadata: AccountNodeMetadata = {
              ...node.metadata,
              gpaFields: newGpaFields,
              ...updates,
            };

            if (nodes.isStructTypeNode(node.type)) {
              return nodes.accountNode(
                newMetadata,
                renameStructNode(node.type, data, newName)
              );
            }

            return nodes.accountNode(newMetadata, node.type);
          },
        };
      }
    );

    super(transforms);
  }
}
