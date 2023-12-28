import {
  AccountNode,
  InstructionAccountNode,
  InstructionAccountNodeInput,
  InstructionDataArgsNode,
  InstructionExtraArgsNode,
  InstructionNode,
  InstructionNodeInput,
  TypeNode,
  assertInstructionNode,
  assertTypeNode,
  getAllAccounts,
  instructionAccountNode,
  instructionDataArgsNode,
  instructionExtraArgsNode,
  instructionNode,
  structFieldTypeNode,
  structTypeNode,
} from '../nodes';
import {
  InstructionAccountDefault,
  InstructionArgDefault,
  MainCaseString,
  getDefaultSeedsFromAccount,
  mainCase,
  pipe,
} from '../shared';
import {
  BottomUpNodeTransformer,
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';
import { tapVisitor } from './tapVisitor';

export type InstructionUpdates =
  | BottomUpNodeTransformer<InstructionNode>
  | { delete: true }
  | (InstructionMetadataUpdates & {
      accounts?: InstructionAccountUpdates;
      args?: InstructionArgUpdates;
    });

export type InstructionMetadataUpdates = Partial<
  Omit<
    InstructionNodeInput,
    'accounts' | 'dataArgs' | 'extraArgs' | 'subInstructions' | 'argDefaults'
  >
>;

export type InstructionAccountUpdates = Record<
  string,
  Partial<Omit<InstructionAccountNodeInput, 'defaultsTo'>> & {
    defaultsTo?: InstructionAccountDefault | null;
  }
>;

export type InstructionArgUpdates = Record<
  string,
  {
    name?: string;
    docs?: string[];
    type?: TypeNode;
    defaultsTo?: InstructionArgDefault | null;
  }
>;

export function updateInstructionsVisitor(
  map: Record<string, InstructionUpdates>
) {
  let allAccounts = new Map<string, AccountNode>();

  const transformers = Object.entries(map).map(
    ([selector, updates]): BottomUpNodeTransformerWithSelector => {
      const selectorStack = selector.split('.');
      const name = selectorStack.pop();
      return {
        select: `${selectorStack.join('.')}.[instructionNode]${name}`,
        transform: (node, stack) => {
          assertInstructionNode(node);
          if (typeof updates === 'function') {
            return updates(node, stack);
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
            handleInstructionArgs(node, newName, argsUpdates ?? {});
          const newAccounts = node.accounts.map((account) =>
            handleInstructionAccount(account, accountUpdates ?? {}, allAccounts)
          );

          return instructionNode({
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

  return pipe(bottomUpTransformerVisitor(transformers), (v) =>
    tapVisitor(v, 'rootNode', (root) => {
      allAccounts = new Map(
        getAllAccounts(root).map((account) => [account.name, account])
      );
    })
  );
}

function handleInstructionAccount(
  account: InstructionAccountNode,
  accountUpdates: InstructionAccountUpdates,
  allAccounts: Map<string, AccountNode>
): InstructionAccountNode {
  const accountUpdate = accountUpdates?.[account.name];
  if (!accountUpdate) return account;
  const { defaultsTo, ...acountWithoutDefault } = {
    ...account,
    ...accountUpdate,
  };

  if (defaultsTo === null) {
    return instructionAccountNode(acountWithoutDefault);
  }

  if (defaultsTo?.kind === 'pda') {
    const pdaAccount = mainCase(defaultsTo.pdaAccount);
    const foundAccount = allAccounts.get(pdaAccount);
    return {
      ...acountWithoutDefault,
      name: mainCase(acountWithoutDefault.name),
      defaultsTo: {
        ...defaultsTo,
        seeds: {
          ...(foundAccount ? getDefaultSeedsFromAccount(foundAccount) : {}),
          ...defaultsTo.seeds,
        },
      },
    };
  }

  return instructionAccountNode({
    ...acountWithoutDefault,
    defaultsTo,
  });
}

function handleInstructionArgs(
  instruction: InstructionNode,
  newInstructionName: string,
  argUpdates: InstructionArgUpdates
): {
  newDataArgs: InstructionDataArgsNode;
  newExtraArgs: InstructionExtraArgsNode;
  newArgDefaults: Record<string, InstructionArgDefault>;
} {
  const usedArgs = new Set<string>();

  const newDataArgs = instructionDataArgsNode({
    ...instruction.dataArgs,
    name: `${newInstructionName}InstructionData`,
    struct: structTypeNode(
      instruction.dataArgs.struct.fields.map((field) => {
        const argUpdate = argUpdates[field.name];
        if (!argUpdate) return field;
        usedArgs.add(field.name);
        return structFieldTypeNode({
          ...field,
          child: argUpdate.type ?? field.child,
          name: argUpdate.name ?? field.name,
          docs: argUpdate.docs ?? field.docs,
        });
      })
    ),
  });

  const updatedExtraFields = instruction.extraArgs.struct.fields.map(
    (field) => {
      if (usedArgs.has(field.name)) return field;
      const argUpdate = argUpdates[field.name];
      if (!argUpdate) return field;
      usedArgs.add(field.name);
      return structFieldTypeNode({
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
      assertTypeNode(child);
      return structFieldTypeNode({
        name: argUpdate.name ?? argName,
        child,
        docs: argUpdate.docs ?? [],
      });
    });

  const newExtraArgs = instructionExtraArgsNode({
    ...instruction.extraArgs,
    name: `${newInstructionName}InstructionExtra`,
    struct: structTypeNode([...updatedExtraFields, ...newExtraFields]),
  });

  const newArgDefaults = instruction.argDefaults;
  Object.entries(argUpdates).forEach(([argName, argUpdate]) => {
    if (argUpdate?.defaultsTo === undefined) return;
    if (argUpdate.defaultsTo === null) {
      delete newArgDefaults[argName as MainCaseString];
    } else {
      newArgDefaults[argName as MainCaseString] = argUpdate.defaultsTo;
    }
  });

  return { newDataArgs, newExtraArgs, newArgDefaults };
}
