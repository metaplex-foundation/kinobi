import type { IdlInstruction } from '../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import {
  InstructionAccountNode,
  instructionAccountNodesFromIdl,
} from './InstructionAccountNode';
import {
  InstructionArgumentNode,
  instructionArgumentNode,
  instructionArgumentNodeFromIdl,
} from './InstructionArgumentNode';
import { InstructionByteDeltaNode } from './InstructionByteDeltaNode';
import { InstructionRemainingAccountsNode } from './InstructionRemainingAccountsNode';
import { isNode } from './Node';
import { ProgramNode } from './ProgramNode';
import { RootNode, getAllInstructions } from './RootNode';
import {
  DiscriminatorNode,
  fieldDiscriminatorNode,
} from './discriminatorNodes';
import { createTypeNodeFromIdl } from './typeNodes/TypeNode';
import { numberValueNode } from './valueNodes';

type SubInstructionNode = InstructionNode;

export interface InstructionNode<
  TAccounts extends InstructionAccountNode[] = InstructionAccountNode[],
  TArguments extends InstructionArgumentNode[] = InstructionArgumentNode[],
  TExtraArguments extends InstructionArgumentNode[] | undefined =
    | InstructionArgumentNode[]
    | undefined,
  TRemainingAccounts extends InstructionRemainingAccountsNode[] | undefined =
    | InstructionRemainingAccountsNode[]
    | undefined,
  TByteDeltas extends InstructionByteDeltaNode[] | undefined =
    | InstructionByteDeltaNode[]
    | undefined,
  TDiscriminators extends DiscriminatorNode[] | undefined =
    | DiscriminatorNode[]
    | undefined,
  TSubInstructions extends SubInstructionNode[] | undefined =
    | SubInstructionNode[]
    | undefined,
> {
  readonly kind: 'instructionNode';

  // Children.
  readonly accounts: TAccounts;
  readonly arguments: TArguments;
  readonly extraArguments?: TExtraArguments;
  readonly remainingAccounts?: TRemainingAccounts;
  readonly byteDeltas?: TByteDeltas;
  readonly discriminators?: TDiscriminators;
  readonly subInstructions?: TSubInstructions;

  // Data.
  readonly name: MainCaseString;
  readonly idlName: string;
  readonly docs: string[];
  readonly optionalAccountStrategy: 'omitted' | 'programId';
}

export type InstructionNodeInput<
  TAccounts extends InstructionAccountNode[] = InstructionAccountNode[],
  TArguments extends InstructionArgumentNode[] = InstructionArgumentNode[],
  TExtraArguments extends InstructionArgumentNode[] | undefined =
    | InstructionArgumentNode[]
    | undefined,
  TRemainingAccounts extends InstructionRemainingAccountsNode[] | undefined =
    | InstructionRemainingAccountsNode[]
    | undefined,
  TByteDeltas extends InstructionByteDeltaNode[] | undefined =
    | InstructionByteDeltaNode[]
    | undefined,
  TDiscriminators extends DiscriminatorNode[] | undefined =
    | DiscriminatorNode[]
    | undefined,
  TSubInstructions extends SubInstructionNode[] | undefined =
    | SubInstructionNode[]
    | undefined,
> = Omit<
  Partial<
    InstructionNode<
      TAccounts,
      TArguments,
      TExtraArguments,
      TRemainingAccounts,
      TByteDeltas,
      TDiscriminators,
      TSubInstructions
    >
  >,
  'kind' | 'name'
> & {
  readonly name: string;
};

export function instructionNode<
  const TAccounts extends InstructionAccountNode[] = [],
  const TArguments extends InstructionArgumentNode[] = [],
  const TExtraArguments extends
    | InstructionArgumentNode[]
    | undefined = undefined,
  const TRemainingAccounts extends
    | InstructionRemainingAccountsNode[]
    | undefined = undefined,
  const TByteDeltas extends InstructionByteDeltaNode[] | undefined = undefined,
  const TDiscriminators extends DiscriminatorNode[] | undefined = undefined,
  const TSubInstructions extends SubInstructionNode[] | undefined = undefined,
>(
  input: InstructionNodeInput<
    TAccounts,
    TArguments,
    TExtraArguments,
    TRemainingAccounts,
    TByteDeltas,
    TDiscriminators,
    TSubInstructions
  >
): InstructionNode<
  TAccounts,
  TArguments,
  TExtraArguments,
  TRemainingAccounts,
  TByteDeltas,
  TDiscriminators,
  TSubInstructions
> {
  if (!input.name) {
    throw new InvalidKinobiTreeError('InstructionNode must have a name.');
  }
  const name = mainCase(input.name);
  return {
    kind: 'instructionNode',

    // Children.
    accounts: (input.accounts ?? []) as TAccounts,
    arguments: (input.arguments ?? []) as TArguments,
    extraArguments: input.extraArguments,
    remainingAccounts: input.remainingAccounts,
    byteDeltas: input.byteDeltas,
    discriminators: input.discriminators,
    subInstructions: input.subInstructions,

    // Data.
    name,
    idlName: input.idlName ?? input.name,
    docs: input.docs ?? [],
    optionalAccountStrategy: input.optionalAccountStrategy ?? 'programId',
  };
}

export function instructionNodeFromIdl(
  idl: Partial<IdlInstruction>
): InstructionNode {
  const idlName = idl.name ?? '';
  const name = mainCase(idlName);
  let dataArguments = (idl.args ?? []).map(instructionArgumentNodeFromIdl);
  let discriminators: DiscriminatorNode[] | undefined;
  if (idl.discriminant) {
    const discriminatorField = instructionArgumentNode({
      name: 'discriminator',
      // @ts-ignore
      type: createTypeNodeFromIdl(idl.discriminant.type),
      // @ts-ignore
      defaultValue: numberValueNode(idl.discriminant.value),
      defaultValueStrategy: 'omitted',
    });
    dataArguments = [discriminatorField, ...dataArguments];
    discriminators = [fieldDiscriminatorNode('discriminator')];
  }
  return instructionNode({
    name,
    idlName,
    docs: idl.docs ?? [],
    accounts: instructionAccountNodesFromIdl(idl.accounts ?? []),
    arguments: dataArguments,
    discriminators,
    optionalAccountStrategy: idl.legacyOptionalAccountsStrategy
      ? 'omitted'
      : 'programId',
  });
}

export function getAllInstructionArguments(
  node: InstructionNode
): InstructionArgumentNode[] {
  return [...node.arguments, ...(node.extraArguments ?? [])];
}

export function getAllInstructionsWithSubs(
  node: ProgramNode | RootNode | InstructionNode,
  config: { leavesOnly?: boolean; subInstructionsFirst?: boolean } = {}
): InstructionNode[] {
  const { leavesOnly = false, subInstructionsFirst = false } = config;
  if (isNode(node, 'instructionNode')) {
    if (!node.subInstructions || node.subInstructions.length === 0)
      return [node];
    const subInstructions = node.subInstructions.flatMap((sub) =>
      getAllInstructionsWithSubs(sub, config)
    );
    if (leavesOnly) return subInstructions;
    return subInstructionsFirst
      ? [...subInstructions, node]
      : [node, ...subInstructions];
  }

  const instructions = isNode(node, 'programNode')
    ? node.instructions
    : getAllInstructions(node);

  return instructions.flatMap((instruction) =>
    getAllInstructionsWithSubs(instruction, config)
  );
}
