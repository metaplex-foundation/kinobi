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
    docs?: string[];
    type?: nodes.TypeNode;
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
            const { newArgs, newExtraArgs, newArgDefaults } =
              this.handleInstructionArgs(node, newName, argsUpdates ?? {});
            const newMetadata = {
              ...node.metadata,
              ...this.handleMetadata(metadataUpdates),
              argDefaults: newArgDefaults,
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
    newInstructionName: string,
    argUpdates: InstructionArgUpdates
  ): {
    newArgs: nodes.TypeStructNode | nodes.TypeDefinedLinkNode;
    newExtraArgs: nodes.TypeStructNode | nodes.TypeDefinedLinkNode;
    newArgDefaults: Record<string, nodes.InstructionNodeArgDefaults>;
  } {
    const usedArgs = new Set<string>();

    let newArgs = instruction.args;
    if (!nodes.isTypeDefinedLinkNode(instruction.args)) {
      const fields = instruction.args.fields.map((field) => {
        const argUpdate = argUpdates[field.name];
        if (!argUpdate) return field;
        usedArgs.add(field.name);
        return new nodes.TypeStructFieldNode(
          {
            ...field.metadata,
            name: argUpdate.name ?? field.name,
            docs: argUpdate.docs ?? field.metadata.docs,
          },
          argUpdate.type ?? field.type
        );
      });
      newArgs = new nodes.TypeStructNode(
        `${newInstructionName}InstructionData`,
        fields
      );
    }

    let newExtraArgs = instruction.extraArgs;
    if (!nodes.isTypeDefinedLinkNode(instruction.extraArgs)) {
      const fields = instruction.extraArgs.fields.map((field) => {
        if (usedArgs.has(field.name)) return field;
        const argUpdate = argUpdates[field.name];
        if (!argUpdate) return field;
        usedArgs.add(field.name);
        return new nodes.TypeStructFieldNode(
          {
            ...field.metadata,
            name: argUpdate.name ?? field.name,
            docs: argUpdate.docs ?? field.metadata.docs,
          },
          argUpdate.type ?? field.type
        );
      });

      const newExtraFields = Object.entries(argUpdates)
        .filter(([argName]) => !usedArgs.has(argName))
        .map(([argName, argUpdate]) => {
          const type = argUpdate.type ?? null;
          nodes.assertTypeNode(type);
          return new nodes.TypeStructFieldNode(
            {
              name: argUpdate.name ?? argName,
              docs: argUpdate.docs ?? [],
              defaultsTo: null,
            },
            type
          );
        });
      fields.push(...newExtraFields);

      newExtraArgs = new nodes.TypeStructNode(
        `${newInstructionName}InstructionExtra`,
        fields
      );
    }

    const newArgDefaults = instruction.metadata.argDefaults;
    Object.entries(argUpdates).forEach(([argName, argUpdate]) => {
      if (argUpdate?.defaultsTo === undefined) return;
      if (argUpdate.defaultsTo === null) {
        delete newArgDefaults[argName];
      } else {
        newArgDefaults[argName] = this.parseDefaultArg(argUpdate.defaultsTo);
      }
    });

    return { newArgs, newExtraArgs, newArgDefaults };
  }

  parseDefaultArg(
    argDefault: InstructionNodeArgDefaultsInput
  ): nodes.InstructionNodeArgDefaults {
    if (argDefault?.kind === 'resolver') {
      return { importFrom: 'hooked', dependsOn: [], ...argDefault };
    }
    return argDefault;
  }
}
