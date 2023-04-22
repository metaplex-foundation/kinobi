import * as nodes from '../../nodes';
import {
  InstructionArgDefault,
  getDefaultSeedsFromAccount,
  mainCase,
} from '../../shared';
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
  Omit<
    nodes.InstructionNodeInput,
    'accounts' | 'dataArgs' | 'extraArgs' | 'subInstructions' | 'argDefaults'
  >
>;

export type InstructionAccountUpdates = Record<
  string,
  Partial<nodes.InstructionAccountNodeInput>
>;

export type InstructionArgUpdates = Record<
  string,
  {
    name?: string;
    docs?: string[];
    type?: nodes.TypeNode;
    defaultsTo?: InstructionArgDefault | null;
  }
>;

export class UpdateInstructionsVisitor extends TransformNodesVisitor {
  protected allAccounts = new Map<string, nodes.AccountNode>();

  constructor(readonly map: Record<string, InstructionUpdates>) {
    const transforms = Object.entries(map).map(
      ([selector, updates]): NodeTransform => {
        const selectorStack = selector.split('.');
        const name = selectorStack.pop();
        return {
          selector: { kind: 'instructionNode', stack: selectorStack, name },
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
            const { newDataArgs, newExtraArgs, newArgDefaults } =
              this.handleInstructionArgs(node, newName, argsUpdates ?? {});
            const newAccounts = node.accounts.map((account) =>
              this.handleInstructionAccount(account, accountUpdates ?? {})
            );

            return nodes.instructionNode({
              ...node,
              ...metadataUpdates,
              argDefaults: newArgDefaults,
              accounts: newAccounts,
              dataArgs: newDataArgs,
              extraArgs: newExtraArgs,
            });
          },
        };
      }
    );

    super(transforms);
  }

  visitRoot(root: nodes.RootNode): nodes.Node | null {
    nodes.getAllAccounts(root).forEach((account) => {
      this.allAccounts.set(account.name, account);
    });
    return super.visitRoot(root);
  }

  handleInstructionAccount(
    account: nodes.InstructionAccountNode,
    accountUpdates: InstructionAccountUpdates
  ): nodes.InstructionAccountNode {
    const accountUpdate = accountUpdates?.[account.name];

    if (accountUpdate?.defaultsTo?.kind === 'pda') {
      const pdaAccount = mainCase(accountUpdate.defaultsTo.pdaAccount);
      const foundAccount = this.allAccounts.get(pdaAccount);
      return {
        ...account,
        ...accountUpdate,
        defaultsTo: {
          ...accountUpdate.defaultsTo,
          seeds: {
            ...(foundAccount ? getDefaultSeedsFromAccount(foundAccount) : {}),
            ...accountUpdate.defaultsTo.seeds,
          },
        },
      };
    }

    return accountUpdate ? { ...account, ...accountUpdate } : account;
  }

  handleInstructionArgs(
    instruction: nodes.InstructionNode,
    newInstructionName: string,
    argUpdates: InstructionArgUpdates
  ): {
    newDataArgs: nodes.InstructionDataArgsNode;
    newExtraArgs: nodes.InstructionExtraArgsNode;
    newArgDefaults: Record<string, InstructionArgDefault>;
  } {
    const usedArgs = new Set<string>();

    let newDataArgs = instruction.args;
    if (!nodes.isLinkTypeNode(instruction.args)) {
      const fields = instruction.args.fields.map((field) => {
        const argUpdate = argUpdates[field.name];
        if (!argUpdate) return field;
        usedArgs.add(field.name);
        return nodes.structFieldTypeNode(
          {
            ...field.metadata,
            name: argUpdate.name ?? field.name,
            docs: argUpdate.docs ?? field.metadata.docs,
          },
          argUpdate.type ?? field.type
        );
      });
      newDataArgs = nodes.structTypeNode(
        `${newInstructionName}InstructionData`,
        fields
      );
    }

    let newExtraArgs = instruction.extraArgs;
    if (!nodes.isLinkTypeNode(instruction.extraArgs)) {
      const fields = instruction.extraArgs.fields.map((field) => {
        if (usedArgs.has(field.name)) return field;
        const argUpdate = argUpdates[field.name];
        if (!argUpdate) return field;
        usedArgs.add(field.name);
        return nodes.structFieldTypeNode(
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
          return nodes.structFieldTypeNode(
            {
              name: argUpdate.name ?? argName,
              docs: argUpdate.docs ?? [],
              defaultsTo: null,
            },
            type
          );
        });
      fields.push(...newExtraFields);

      newExtraArgs = nodes.structTypeNode(
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

    return { newDataArgs, newExtraArgs, newArgDefaults };
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
