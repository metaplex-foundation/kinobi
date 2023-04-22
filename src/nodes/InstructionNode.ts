import type { IdlInstruction } from '../idl';
import {
  BytesCreatedOnChain,
  InstructionArgDefault,
  InvalidKinobiTreeError,
  PartialExcept,
  mainCase,
} from '../shared';
import {
  InstructionAccountNode,
  instructionAccountNodeFromIdl,
} from './InstructionAccountNode';
import {
  InstructionDataArgsNode,
  instructionDataArgsNode,
} from './InstructionDataArgsNode';
import {
  InstructionExtraArgsNode,
  instructionExtraArgsNode,
} from './InstructionExtraArgsNode';
import type { Node } from './Node';
import { ProgramNode, isProgramNode } from './ProgramNode';
import { RootNode } from './RootNode';
import { structFieldTypeNode } from './StructFieldTypeNode';
import { structTypeNode, structTypeNodeFromIdl } from './StructTypeNode';
import { createTypeNodeFromIdl } from './TypeNode';
import { vScalar } from './ValueNode';

export type InstructionNode = {
  readonly __instructionNode: unique symbol;
  readonly nodeClass: 'instructionNode';
  readonly name: string;
  readonly accounts: InstructionAccountNode[];
  readonly dataArgs: InstructionDataArgsNode;
  readonly extraArgs: InstructionExtraArgsNode;
  readonly subInstructions: InstructionNode[];
  readonly idlName: string;
  readonly docs: string[];
  readonly internal: boolean;
  readonly bytesCreatedOnChain?: BytesCreatedOnChain;
  readonly argDefaults: Record<string, InstructionArgDefault>;
};

export type InstructionNodeInput = Omit<
  PartialExcept<InstructionNode, 'name' | 'accounts' | 'dataArgs'>,
  '__instructionNode' | 'nodeClass'
>;

export function instructionNode(input: InstructionNodeInput): InstructionNode {
  if (!input.name) {
    throw new InvalidKinobiTreeError('InstructionNodeInput must have a name.');
  }
  const name = mainCase(input.name);
  return {
    nodeClass: 'instructionNode',
    name,
    accounts: input.accounts,
    dataArgs: input.dataArgs,
    extraArgs:
      input.extraArgs ??
      instructionExtraArgsNode(structTypeNode(`${name}InstructionExtra`, [])),
    subInstructions: input.subInstructions ?? [],
    idlName: input.idlName ?? input.name,
    docs: input.docs ?? [],
    internal: input.internal ?? false,
    bytesCreatedOnChain: input.bytesCreatedOnChain,
    argDefaults: Object.fromEntries(
      Object.entries(input.argDefaults ?? {}).map(([key, value]) => [
        mainCase(key),
        value,
      ])
    ),
  } as InstructionNode;
}

export function instructionNodeFromIdl(
  idl: Partial<IdlInstruction>
): InstructionNode {
  const idlName = idl.name ?? '';
  const name = mainCase(idlName);
  const useProgramIdForOptionalAccounts = idl.defaultOptionalAccounts ?? false;
  let dataArgs = structTypeNodeFromIdl({
    kind: 'struct',
    name: name ? `${name}InstructionData` : '',
    fields: idl.args ?? [],
  });
  if (idl.discriminant) {
    const discriminatorField = structFieldTypeNode({
      name: 'discriminator',
      child: createTypeNodeFromIdl(idl.discriminant.type),
      defaultsTo: {
        strategy: 'omitted',
        value: vScalar(idl.discriminant.value),
      },
    });
    dataArgs = structTypeNode(dataArgs.name, [
      discriminatorField,
      ...dataArgs.fields,
    ]);
  }
  return instructionNode({
    name,
    idlName,
    docs: idl.docs ?? [],
    accounts: (idl.accounts ?? []).map((account) =>
      instructionAccountNodeFromIdl(account, useProgramIdForOptionalAccounts)
    ),
    dataArgs: instructionDataArgsNode(dataArgs),
  });
}

export function getAllSubInstructions(
  node: InstructionNode
): InstructionNode[] {
  return node.subInstructions.flatMap((subInstruction) => [
    subInstruction,
    ...getAllSubInstructions(subInstruction),
  ]);
}

export function getAllInstructionsWithSubs(
  node: ProgramNode | RootNode
): InstructionNode[] {
  const instructions = isProgramNode(node)
    ? node.instructions
    : node.programs.flatMap((program) => program.instructions);

  return instructions.flatMap((instruction) => [
    instruction,
    ...getAllSubInstructions(instruction),
  ]);
}

// export function hasLinkedArgs(): boolean {
//   return isLinkTypeNode(this.args);
// }

// export function hasLinkedExtraArgs(): boolean {
//   return isLinkTypeNode(this.extraArgs);
// }

// export function hasAccounts(): boolean {
//   return this.accounts.length > 0;
// }

// export function hasData(): boolean {
//   if (isLinkTypeNode(this.args)) return true;
//   return this.args.fields.length > 0;
// }

// export function hasArgs(): boolean {
//   if (isLinkTypeNode(this.args)) return true;
//   const nonOmittedFields = this.args.fields.filter(
//     (field) => field.metadata.defaultsTo?.strategy !== 'omitted'
//   );
//   return nonOmittedFields.length > 0;
// }

// export function hasExtraArgs(): boolean {
//   if (isLinkTypeNode(this.extraArgs)) return true;
//   const nonOmittedFields = this.extraArgs.fields.filter(
//     (field) => field.metadata.defaultsTo?.strategy !== 'omitted'
//   );
//   return nonOmittedFields.length > 0;
// }

// export function hasAnyArgs(): boolean {
//   return this.hasArgs || this.hasExtraArgs;
// }

// export function hasArgDefaults(): boolean {
//   return Object.keys(this.metadata.argDefaults).length > 0;
// }

// export function hasArgResolvers(): boolean {
//   return Object.values(this.metadata.argDefaults).some(
//     ({ kind }) => kind === 'resolver'
//   );
// }

// export function hasAccountResolvers(): boolean {
//   return this.accounts.some(
//     ({ defaultsTo }) => defaultsTo?.kind === 'resolver'
//   );
// }

// export function hasByteResolver(): boolean {
//   return this.metadata.bytesCreatedOnChain?.kind === 'resolver';
// }

// export function hasResolvers(): boolean {
//   return (
//     this.hasArgResolvers || this.hasAccountResolvers || this.hasByteResolver
//   );
// }

export function isInstructionNode(node: Node | null): node is InstructionNode {
  return !!node && node.nodeClass === 'instructionNode';
}

export function assertInstructionNode(
  node: Node | null
): asserts node is InstructionNode {
  if (!isInstructionNode(node)) {
    throw new Error(
      `Expected InstructionNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
