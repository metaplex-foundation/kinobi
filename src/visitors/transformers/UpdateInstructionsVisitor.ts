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
      accounts?: InstructionAccountUpdates;
    });

export type InstructionAccountUpdates = Record<
  string,
  Partial<nodes.InstructionNodeAccount>
>;

export class UpdateInstructionsVisitor extends TransformNodesVisitor {
  protected allAccounts = new Map<string, nodes.AccountNode>();

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
              node.accounts.map((account) =>
                this.handleInstructionAccount(account, accountUpdates ?? {})
              ),
              node.args // TODO: update fields?
            );
          },
        };
      }
    );

    super(transforms);
  }

  visitRoot(root: nodes.RootNode): nodes.Node | null {
    root.allAccounts.forEach((account) => {
      this.allAccounts.set(account.name, account);
    });
    return super.visitRoot(root);
  }

  handleInstructionAccount(
    account: nodes.InstructionNodeAccount,
    accountUpdates: InstructionAccountUpdates
  ): nodes.InstructionNodeAccount {
    const accountUpdate = accountUpdates?.[account.name];
    return accountUpdate ? { ...account, ...accountUpdate } : account;
  }
}
