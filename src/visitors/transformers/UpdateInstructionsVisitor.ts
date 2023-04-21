import * as nodes from '../../nodes';
import { mainCase } from '../../utils';
import { ImportFrom } from '../ImportFrom';
import { InstructionNodeAccountDefaultsInput } from './SetInstructionAccountDefaultValuesVisitor';
import {
  NodeTransform,
  NodeTransformer,
  TransformNodesVisitor,
} from './TransformNodesVisitor';

export type InstructionUpdates =
  | NodeTransformer<nodes.InstructionNode>
  | { delete: true }
  | (InstructionMetadataUpdates & {
      accounts?: InstructionAccountUpdates;
      args?: InstructionArgUpdates;
    });

export type InstructionMetadataUpdates = Partial<
  Omit<nodes.InstructionNodeMetadata, 'bytesCreatedOnChain'> & {
    bytesCreatedOnChain: InstructionNodeBytesCreatedOnChainInput | null;
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

export type InstructionNodeArgDefaultsInput =
  | nodes.InstructionNodeArgDefaults
  | {
      kind: 'resolver';
      name: string;
      importFrom?: ImportFrom;
      dependsOn?: nodes.InstructionNodeInputDependency[];
    };

export type InstructionArgUpdates = Record<
  string,
  {
    name?: string;
    type?: nodes.TypeStructNode | nodes.TypeDefinedLinkNode | null;
    defaultsTo?: nodes.InstructionNodeArgDefaults | null;
  }
>;

type InstructionNodeBytesCreatedOnChainInput =
  | { kind: 'number'; value: number; includeHeader?: boolean }
  | { kind: 'arg'; name: string; includeHeader?: boolean }
  | {
      kind: 'account';
      name: string;
      importFrom?: ImportFrom;
      includeHeader?: boolean;
    }
  | { kind: 'resolver'; name: string; importFrom?: ImportFrom };

export class UpdateInstructionsVisitor extends TransformNodesVisitor {
  protected allAccounts = new Map<string, nodes.AccountNode>();

  constructor(readonly map: Record<string, InstructionUpdates>) {
    const transforms = Object.entries(map).map(
      ([selector, updates]): NodeTransform => {
        const selectorStack = selector.split('.');
        const name = selectorStack.pop();
        return {
          selector: { type: 'InstructionNode', stack: selectorStack, name },
          transformer: (node, stack, program) => {
            nodes.assertInstructionNode(node);
            if (typeof updates === 'function') {
              return updates(node, stack, program);
            }
            if ('delete' in updates) {
              return null;
            }

            const {
              accounts: accountUpdates,
              args: argsUpdates,
              ...metadataUpdates
            } = updates;
            const newName = mainCase(updates.name ?? node.name);
            const {
              args: newArgs,
              extraArgs: newExtraArgs,
              argDefaults,
            } = this.handleInstructionArgs(node, newName, argsUpdates ?? {});
            const newMetadata = {
              ...node.metadata,
              ...this.handleMetadata(metadataUpdates),
              argDefaults,
            };
            const newAccounts = node.accounts.map((account) =>
              this.handleInstructionAccount(account, accountUpdates ?? {})
            );

            return new nodes.InstructionNode(
              newMetadata,
              newAccounts,
              newArgs,
              newExtraArgs,
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
    if (metadataUpdates.bytesCreatedOnChain) {
      if (metadataUpdates.bytesCreatedOnChain.kind === 'account') {
        metadata.bytesCreatedOnChain = {
          includeHeader: true,
          importFrom: 'generated',
          ...metadataUpdates.bytesCreatedOnChain,
        } as nodes.InstructionNodeBytesCreatedOnChain;
      } else if (metadataUpdates.bytesCreatedOnChain.kind === 'resolver') {
        metadata.bytesCreatedOnChain = {
          importFrom: 'hooked',
          ...metadataUpdates.bytesCreatedOnChain,
        } as nodes.InstructionNodeBytesCreatedOnChain;
      } else {
        metadata.bytesCreatedOnChain = {
          includeHeader: true,
          ...metadataUpdates.bytesCreatedOnChain,
        } as nodes.InstructionNodeBytesCreatedOnChain;
      }
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
        ...accountUpdate,
        defaultsTo: {
          pdaAccount,
          importFrom: 'generated',
          seeds:
            this.allAccounts.get(pdaAccount)?.instructionAccountDefaultSeeds ??
            {},
          ...accountUpdate?.defaultsTo,
        },
      };
    }
    if (accountUpdate?.defaultsTo?.kind === 'resolver') {
      return {
        ...account,
        ...accountUpdate,
        defaultsTo: {
          importFrom: 'hooked',
          dependsOn: [],
          ...accountUpdate?.defaultsTo,
        },
      };
    }

    return accountUpdate
      ? ({ ...account, ...accountUpdate } as nodes.InstructionNodeAccount)
      : account;
  }

  handleInstructionArgs(
    instruction: nodes.InstructionNode,
    newName: string,
    argUpdates: InstructionArgUpdates
  ): {
    args: nodes.TypeStructNode | nodes.TypeDefinedLinkNode;
    extraArgs: nodes.TypeStructNode | nodes.TypeDefinedLinkNode | null;
    argDefaults: Record<string, nodes.InstructionNodeArgDefaults>;
  } {
    // TODO
    throw new Error('Not yet implemented');
  }
}
