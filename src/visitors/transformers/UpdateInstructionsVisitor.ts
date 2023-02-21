import * as nodes from '../../nodes';
import { mainCase } from '../../utils';
import { Dependency } from '../Dependency';
import { InstructionNodeAccountDefaultsInput } from './SetInstructionAccountDefaultValuesVisitor';
import {
  NodeTransform,
  NodeTransformer,
  TransformNodesVisitor,
} from './TransformNodesVisitor';
import { renameStructNode } from './_renameHelpers';

export type InstructionUpdates =
  | NodeTransformer<nodes.InstructionNode>
  | { delete: true }
  | (InstructionMetadataUpdates & {
      accounts?: InstructionAccountUpdates;
      args?: Record<string, string>;
      link?: true | string | { name: string; dependency: Dependency };
    });

export type InstructionMetadataUpdates = Partial<
  Omit<nodes.InstructionNodeMetadata, 'bytesCreatedOnChain'> & {
    bytesCreatedOnChain: InstructionNodeBytesCreatedOnChainInput;
    accounts: InstructionAccountUpdates;
  }
>;

export type InstructionAccountUpdates = Record<
  string,
  Partial<
    Omit<nodes.InstructionNodeAccount, 'defaultsTo'> & {
      defaultsTo: InstructionNodeAccountDefaultsInput;
    }
  >
>;

type InstructionNodeBytesCreatedOnChainInput =
  | { kind: 'number'; value: number; includeHeader?: boolean }
  | { kind: 'arg'; name: string; includeHeader?: boolean }
  | {
      kind: 'account';
      name: string;
      dependency?: string;
      includeHeader?: boolean;
    }
  | { kind: 'none' };

export class UpdateInstructionsVisitor extends TransformNodesVisitor {
  protected allAccounts = new Map<string, nodes.AccountNode>();

  constructor(readonly map: Record<string, InstructionUpdates>) {
    const transforms = Object.entries(map).map(
      ([selector, updates]): NodeTransform => {
        const selectorStack = selector.split('.');
        const name = selectorStack.pop();
        return {
          selector: { type: 'instruction', stack: selectorStack, name },
          transformer: (node, stack, program) => {
            nodes.assertInstructionNode(node);
            if (typeof updates === 'function') {
              return updates(node, stack, program);
            }
            if ('delete' in updates) {
              return null;
            }
            const { accounts: accountUpdates, ...metadataUpdates } = updates;
            const newName = `${mainCase(
              updates.name ?? node.name
            )}InstructionData`;

            const args = updates.args ?? {};
            const link = updates.link ? parseLink(node, updates.link) : null;

            let newArgs: nodes.InstructionNode['args'] = node.args;
            if (link) {
              newArgs = new nodes.TypeDefinedLinkNode(link.name, {
                dependency: link.dependency,
              });
            } else if (nodes.isTypeStructNode(node.args)) {
              newArgs = renameStructNode(node.args, args, newName);
            }

            return new nodes.InstructionNode(
              { ...node.metadata, ...this.handleMetadata(metadataUpdates) },
              node.accounts.map((account) =>
                this.handleInstructionAccount(account, accountUpdates ?? {})
              ),
              newArgs,
              node.subInstructions
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

  handleMetadata(
    metadataUpdates: InstructionMetadataUpdates
  ): Partial<nodes.InstructionNodeMetadata> {
    const metadata = metadataUpdates as Partial<nodes.InstructionNodeMetadata>;
    if (metadata.bytesCreatedOnChain) {
      metadata.bytesCreatedOnChain = {
        includeHeader: true,
        dependency:
          metadata.bytesCreatedOnChain.kind === 'account'
            ? 'generated'
            : undefined,
        ...metadata.bytesCreatedOnChain,
      } as nodes.InstructionNodeBytesCreatedOnChain;
    }
    return metadata;
  }

  handleInstructionAccount(
    account: nodes.InstructionNodeAccount,
    accountUpdates: InstructionAccountUpdates
  ): nodes.InstructionNodeAccount {
    const accountUpdate = accountUpdates?.[account.name];

    if (accountUpdate?.defaultsTo?.kind === 'pda') {
      const pdaAccount = mainCase(
        accountUpdate?.defaultsTo?.pdaAccount ?? account.name
      );
      return {
        ...account,
        defaultsTo: {
          pdaAccount,
          dependency: 'generated',
          seeds:
            this.allAccounts.get(pdaAccount)?.instructionAccountDefaultSeeds ??
            {},
          ...accountUpdate?.defaultsTo,
        },
      };
    }

    return accountUpdate
      ? ({ ...account, ...accountUpdate } as nodes.InstructionNodeAccount)
      : account;
  }
}

function parseLink(
  instruction: nodes.InstructionNode,
  link: true | string | { name: string; dependency: Dependency }
): { name: string; dependency: Dependency } {
  if (typeof link === 'boolean') {
    return { name: `${instruction.name}InstructionData`, dependency: 'hooked' };
  }
  if (typeof link === 'string') {
    return { name: link, dependency: 'hooked' };
  }
  return link;
}
