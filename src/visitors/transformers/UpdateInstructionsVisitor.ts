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

    const newDataArgs = nodes.instructionDataArgsNode(
      nodes.structTypeNode(
        `${newInstructionName}InstructionData`,
        instruction.dataArgs.struct.fields.map((field) => {
          const argUpdate = argUpdates[field.name];
          if (!argUpdate) return field;
          usedArgs.add(field.name);
          return nodes.structFieldTypeNode({
            ...field,
            child: argUpdate.type ?? field.child,
            name: argUpdate.name ?? field.name,
            docs: argUpdate.docs ?? field.docs,
          });
        })
      ),
      instruction.dataArgs.link
    );

    const updatedExtraFields = instruction.extraArgs.struct.fields.map(
      (field) => {
        if (usedArgs.has(field.name)) return field;
        const argUpdate = argUpdates[field.name];
        if (!argUpdate) return field;
        usedArgs.add(field.name);
        return nodes.structFieldTypeNode({
          ...field,
          child: argUpdate.type ?? field.child,
          name: argUpdate.name ?? field.name,
          docs: argUpdate.docs ?? field.docs,
        });
      }
    );

    const newExtraFields = Object.entries(argUpdates)
      .filter(([argName]) => !usedArgs.has(argName))
      .map(([argName, argUpdate]) => {
        const child = argUpdate.type ?? null;
        nodes.assertTypeNode(child);
        return nodes.structFieldTypeNode({
          name: argUpdate.name ?? argName,
          child,
          docs: argUpdate.docs ?? [],
        });
      });

    const newExtraArgs = nodes.instructionExtraArgsNode(
      nodes.structTypeNode(`${newInstructionName}InstructionExtra`, [
        ...updatedExtraFields,
        ...newExtraFields,
      ]),
      instruction.extraArgs.link
    );

    const newArgDefaults = instruction.argDefaults;
    Object.entries(argUpdates).forEach(([argName, argUpdate]) => {
      if (argUpdate?.defaultsTo === undefined) return;
      if (argUpdate.defaultsTo === null) {
        delete newArgDefaults[argName];
      } else {
        newArgDefaults[argName] = argUpdate.defaultsTo;
      }
    });

    return { newDataArgs, newExtraArgs, newArgDefaults };
  }
}
