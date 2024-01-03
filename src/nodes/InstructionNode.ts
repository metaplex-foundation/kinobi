import type { IdlInstruction } from '../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import {
  InstructionAccountNode,
  instructionAccountNodeFromIdl,
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
import { RootNode } from './RootNode';
import { DiscriminatorNode } from './discriminatorNodes';
import { createTypeNodeFromIdl } from './typeNodes/TypeNode';
import { numberValueNode } from './valueNodes';

export type InstructionNode = {
  readonly kind: 'instructionNode';

  // Children.
  readonly accounts: InstructionAccountNode[];
  readonly arguments: InstructionArgumentNode[];
  readonly extraArguments?: InstructionArgumentNode[];
  readonly remainingAccounts?: InstructionRemainingAccountsNode[];
  readonly byteDeltas?: InstructionByteDeltaNode[];
  readonly discriminators?: DiscriminatorNode[];
  readonly subInstructions?: InstructionNode[];

  // Data.
  readonly name: MainCaseString;
  readonly idlName: string;
  readonly docs: string[];
  readonly optionalAccountStrategy: 'omitted' | 'programId';
};

export type InstructionNodeInput = Omit<
  Partial<InstructionNode>,
  'kind' | 'name'
> & {
  readonly name: string;
};

export function instructionNode(input: InstructionNodeInput): InstructionNode {
  if (!input.name) {
    throw new InvalidKinobiTreeError('InstructionNode must have a name.');
  }
  const name = mainCase(input.name);
  return {
    kind: 'instructionNode',

    // Children.
    accounts: input.accounts ?? [],
    arguments: input.arguments ?? [],
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
  if (idl.discriminant) {
    const discriminatorField = instructionArgumentNode({
      name: 'discriminator',
      type: createTypeNodeFromIdl(idl.discriminant.type),
      defaultValue: numberValueNode(idl.discriminant.value),
      defaultValueStrategy: 'omitted',
    });
    dataArguments = [discriminatorField, ...dataArguments];
  }
  return instructionNode({
    name,
    idlName,
    docs: idl.docs ?? [],
    accounts: (idl.accounts ?? []).map((account) =>
      instructionAccountNodeFromIdl(account)
    ),
    arguments: dataArguments,
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
  leavesOnly = false
): InstructionNode[] {
  if (isNode(node, 'instructionNode')) {
    if (!node.subInstructions || node.subInstructions.length === 0)
      return [node];
    const subInstructions = node.subInstructions.flatMap((sub) =>
      getAllInstructionsWithSubs(sub, leavesOnly)
    );
    return leavesOnly ? subInstructions : [node, ...subInstructions];
  }

  const instructions = isNode(node, 'programNode')
    ? node.instructions
    : node.programs.flatMap((program) => program.instructions);

  return instructions.flatMap((instruction) =>
    getAllInstructionsWithSubs(instruction, leavesOnly)
  );
}
