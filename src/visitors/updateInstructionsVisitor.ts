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
  addDefaultSeedValuesFromPdaWhenMissing,
  assertIsNode,
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
  Partial<Omit<InstructionAccountNodeInput, 'defaultValue'>> & {
    defaultValue?: InstructionInputValueNode | null;
  }
>;

export type InstructionArgUpdates = Record<
  string,
  {
    name?: string;
    docs?: string[];
    type?: TypeNode;
    defaultValue?: InstructionInputValueNode | null;
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
  const { defaultValue, ...acountWithoutDefault } = {
    ...account,
    ...accountUpdate,
  };

  if (defaultValue === null) {
    return instructionAccountNode(acountWithoutDefault);
  }

  if (isNode(defaultValue, 'pdaValueNode')) {
    const foundPda = linkables.get(defaultValue.pda);
    return {
      ...acountWithoutDefault,
      name: mainCase(acountWithoutDefault.name),
      defaultValue: {
        ...defaultValue,
        seeds: foundPda
          ? addDefaultSeedValuesFromPdaWhenMissing(foundPda, defaultValue.seeds)
          : defaultValue.seeds,
      },
    };
  }

  return instructionAccountNode({ ...acountWithoutDefault, defaultValue });
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
          type: argUpdate.type ?? field.type,
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
        type: argUpdate.type ?? field.type,
        name: argUpdate.name ?? field.name,
        docs: argUpdate.docs ?? field.docs,
      });
    }
  );

  const newExtraFields = Object.entries(argUpdates)
    .filter(([argName]) => !usedArgs.has(argName))
    .map(([argName, argUpdate]) => {
      const { type } = argUpdate;
      assertIsNode(type, TYPE_NODES);
      return structFieldTypeNode({
        name: argUpdate.name ?? argName,
        type,
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
    if (argUpdate?.defaultValue === undefined) return;
    if (argUpdate.defaultValue === null) {
      delete newArgDefaults[argName as MainCaseString];
    } else {
      newArgDefaults[argName as MainCaseString] = argUpdate.defaultValue;
    }
  });

  return { newDataArgs, newExtraArgs, newArgDefaults };
}
