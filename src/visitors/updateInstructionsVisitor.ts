import {
  InstructionAccountNode,
  InstructionAccountNodeInput,
  InstructionDataArgsNode,
  InstructionExtraArgsNode,
  InstructionInputValueNode,
  InstructionNode,
  InstructionNodeInput,
  TYPE_NODES,
  TypeNode,
  assertIsNode,
  getDefaultSeedValuesFromPda,
  instructionAccountNode,
  instructionDataArgsNode,
  instructionExtraArgsNode,
  instructionNode,
  isNode,
  structFieldTypeNode,
  structTypeNode,
} from '../nodes';
import { LinkableDictionary, MainCaseString, mainCase, pipe } from '../shared';
import {
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';
import { recordLinkablesVisitor } from './recordLinkablesVisitor';

export type InstructionUpdates =
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
    defaultsTo?: InstructionInputValueNode | null;
  }
>;

export type InstructionArgUpdates = Record<
  string,
  {
    name?: string;
    docs?: string[];
    type?: TypeNode;
    defaultsTo?: InstructionInputValueNode | null;
  }
>;

export function updateInstructionsVisitor(
  map: Record<string, InstructionUpdates>
) {
  const linkables = new LinkableDictionary();

  const transformers = Object.entries(map).map(
    ([selector, updates]): BottomUpNodeTransformerWithSelector => {
      const selectorStack = selector.split('.');
      const name = selectorStack.pop();
      return {
        select: `${selectorStack.join('.')}.[instructionNode]${name}`,
        transform: (node) => {
          assertIsNode(node, 'instructionNode');
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
            handleInstructionAccount(account, accountUpdates ?? {}, linkables)
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
    recordLinkablesVisitor(v, linkables)
  );
}

function handleInstructionAccount(
  account: InstructionAccountNode,
  accountUpdates: InstructionAccountUpdates,
  linkables: LinkableDictionary
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

  if (isNode(defaultsTo, 'pdaValueNode')) {
    const foundPda = linkables.get(defaultsTo.pda);
    return {
      ...acountWithoutDefault,
      name: mainCase(acountWithoutDefault.name),
      defaultsTo: {
        ...defaultsTo,
        seeds: {
          ...(foundPda ? getDefaultSeedValuesFromPda(foundPda) : {}),
          ...defaultsTo.seeds,
        },
      },
    };
  }

  return instructionAccountNode({ ...acountWithoutDefault, defaultsTo });
}

function handleInstructionArgs(
  instruction: InstructionNode,
  newInstructionName: string,
  argUpdates: InstructionArgUpdates
): {
  newDataArgs: InstructionDataArgsNode;
  newExtraArgs: InstructionExtraArgsNode;
  newArgDefaults: Record<string, InstructionInputValueNode>;
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
      assertIsNode(child, TYPE_NODES);
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
