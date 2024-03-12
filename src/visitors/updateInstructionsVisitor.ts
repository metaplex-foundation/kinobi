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
      arguments?: InstructionArgumentUpdates;
    });

export type InstructionMetadataUpdates = Partial<
  Omit<
    InstructionNodeInput,
    | 'accounts'
    | 'arguments'
    | 'extraArguments'
    | 'remainingAccounts'
    | 'byteDeltas'
    | 'discriminators'
    | 'subInstructions'
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
      const selectorPrefix =
        selectorStack.length > 0 ? `${selectorStack.join('.')}.` : '';
      return {
        select: `${selectorPrefix}[instructionNode]${name}`,
        transform: (node) => {
          assertIsNode(node, 'instructionNode');
          if ('delete' in updates) {
            return null;
          }

          const {
            accounts: accountUpdates,
            arguments: argumentUpdates,
            ...metadataUpdates
          } = updates;
          const { newArguments, newExtraArguments } =
            handleInstructionArguments(node, argumentUpdates ?? {});
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

function handleInstructionArguments(
  instruction: InstructionNode,
  argUpdates: InstructionArgumentUpdates
): {
  newArguments: InstructionArgumentNode[];
  newExtraArguments: InstructionArgumentNode[];
} {
  const usedArguments = new Set<string>();

  const newArguments = instruction.arguments.map((node) => {
    const argUpdate = argUpdates[node.name];
    if (!argUpdate) return node;
    usedArguments.add(node.name);
    return instructionArgumentNode({
      ...node,
      type: argUpdate.type ?? node.type,
      name: argUpdate.name ?? node.name,
      docs: argUpdate.docs ?? node.docs,
      defaultValue: argUpdate.defaultValue ?? node.defaultValue,
      defaultValueStrategy:
        argUpdate.defaultValueStrategy ?? node.defaultValueStrategy,
    });
  });

  const updatedExtraArguments = (instruction.extraArguments ?? []).map(
    (node) => {
      if (usedArguments.has(node.name)) return node;
      const argUpdate = argUpdates[node.name];
      if (!argUpdate) return node;
      usedArguments.add(node.name);
      return instructionArgumentNode({
        ...node,
        type: argUpdate.type ?? node.type,
        name: argUpdate.name ?? node.name,
        docs: argUpdate.docs ?? node.docs,
        defaultValue: argUpdate.defaultValue ?? node.defaultValue,
        defaultValueStrategy:
          argUpdate.defaultValueStrategy ?? node.defaultValueStrategy,
      });
    }
  );

  const newExtraArguments = [
    ...updatedExtraArguments,
    ...Object.entries(argUpdates)
      .filter(([argName]) => !usedArguments.has(argName))
      .map(([argName, argUpdate]) => {
        const { type } = argUpdate;
        assertIsNode(type, TYPE_NODES);
        return instructionArgumentNode({
          name: argUpdate.name ?? argName,
          type,
          docs: argUpdate.docs ?? [],
          defaultValue: argUpdate.defaultValue ?? undefined,
          defaultValueStrategy: argUpdate.defaultValueStrategy ?? undefined,
        });
      }),
  ];

  return { newArguments, newExtraArguments };
}
