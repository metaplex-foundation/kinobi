import {
  InstructionAccountNode,
  InstructionAccountNodeInput,
  InstructionArgumentNode,
  InstructionArgumentNodeInput,
  InstructionInputValueNode,
  InstructionNode,
  InstructionNodeInput,
  TYPE_NODES,
  assertIsNode,
  instructionAccountNode,
  instructionArgumentNode,
  instructionNode,
} from '../nodes';
import { LinkableDictionary, pipe } from '../shared';
import {
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';
import { fillDefaultPdaSeedValuesVisitor } from './fillDefaultPdaSeedValuesVisitor';
import { recordLinkablesVisitor } from './recordLinkablesVisitor';
import { visit } from './visitor';

export type InstructionUpdates =
  | { delete: true }
  | (InstructionMetadataUpdates & {
      accounts?: InstructionAccountUpdates;
      args?: InstructionArgumentUpdates;
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

export type InstructionArgumentUpdates = Record<
  string,
  Partial<Omit<InstructionArgumentNodeInput, 'defaultValue'>> & {
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
          const { newArguments, newExtraArguments } = handleInstructionArgument(
            node,
            argsUpdates ?? {}
          );
          const newAccounts = node.accounts.map((account) =>
            handleInstructionAccount(
              node,
              account,
              accountUpdates ?? {},
              linkables
            )
          );
          return instructionNode({
            ...node,
            ...metadataUpdates,
            accounts: newAccounts,
            arguments: newArguments,
            extraArguments:
              newExtraArguments.length > 0 ? newExtraArguments : undefined,
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
  instruction: InstructionNode,
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

  if (!defaultValue) {
    return instructionAccountNode(acountWithoutDefault);
  }

  return instructionAccountNode({
    ...acountWithoutDefault,
    defaultValue: visit(
      defaultValue,
      fillDefaultPdaSeedValuesVisitor(instruction, linkables)
    ),
  });
}

function handleInstructionArgument(
  instruction: InstructionNode,
  argUpdates: InstructionArgumentUpdates
): {
  newArguments: InstructionArgumentNode[];
  newExtraArguments: InstructionArgumentNode[];
} {
  const usedArgs = new Set<string>();

  const newArguments = instruction.arguments.map((node) => {
    const argUpdate = argUpdates[node.name];
    if (!argUpdate) return node;
    usedArgs.add(node.name);
    return instructionArgumentNode({
      ...node,
      type: argUpdate.type ?? node.type,
      name: argUpdate.name ?? node.name,
      docs: argUpdate.docs ?? node.docs,
      defaultValue: argUpdate.defaultValue ?? node.defaultValue,
    });
  });

  const updatedExtraArguments = (instruction.extraArguments ?? []).map(
    (node) => {
      if (usedArgs.has(node.name)) return node;
      const argUpdate = argUpdates[node.name];
      if (!argUpdate) return node;
      usedArgs.add(node.name);
      return instructionArgumentNode({
        ...node,
        type: argUpdate.type ?? node.type,
        name: argUpdate.name ?? node.name,
        docs: argUpdate.docs ?? node.docs,
        defaultValue: argUpdate.defaultValue ?? node.defaultValue,
      });
    }
  );

  const newExtraArguments = [
    ...updatedExtraArguments,
    ...Object.entries(argUpdates)
      .filter(([argName]) => !usedArgs.has(argName))
      .map(([argName, argUpdate]) => {
        const { type } = argUpdate;
        assertIsNode(type, TYPE_NODES);
        return instructionArgumentNode({
          name: argUpdate.name ?? argName,
          type,
          docs: argUpdate.docs ?? [],
          defaultValue: argUpdate.defaultValue ?? undefined,
        });
      }),
  ];

  return { newArguments, newExtraArguments };
}
