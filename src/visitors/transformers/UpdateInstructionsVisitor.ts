import * as nodes from '../../nodes';
import {
  NodeTransform,
  NodeTransformer,
  TransformNodesVisitor,
} from './TransformNodesVisitor';

export type InstructionUpdates =
  | NodeTransformer<nodes.InstructionNode>
  | { delete: true }
  | (Partial<nodes.InstructionNodeMetadata> & {
      accounts?: Record<string, Partial<nodes.InstructionNodeAccount>>;
    });

export class UpdateInstructionsVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, InstructionUpdates>) {
    const transforms = Object.entries(map).map(
      ([selector, updates]): NodeTransform => {
        const selectorStack = selector.split('.');
        const name = selectorStack.pop();
        return {
          selector: { type: 'instruction', stack: selectorStack, name },
          transformer: (node, stack, Instruction) => {
            nodes.assertInstructionNode(node);
            if (typeof updates === 'function') {
              return updates(node, stack, Instruction);
            }
            if ('delete' in updates) {
              return null;
            }
            const { accounts: accountUpdates, ...metadataUpdates } = updates;
            return new nodes.InstructionNode(
              { ...node.metadata, ...metadataUpdates },
              node.accounts.map((account) => {
                const accountUpdate = accountUpdates?.[account.name];
                return accountUpdate
                  ? { ...account, ...accountUpdate }
                  : account;
              }),
              node.args // TODO: update fields?
            );
          },
        };
      }
    );

    super(transforms);
  }
}
