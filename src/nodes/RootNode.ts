import type { Idl } from '../idl';
import { readJson } from '../shared';
import type { AccountNode } from './AccountNode';
import type { DefinedTypeNode } from './DefinedTypeNode';
import type { ErrorNode } from './ErrorNode';
import type { InstructionNode } from './InstructionNode';
import { PdaNode } from './PdaNode';
import { ProgramNode, programNodeFromIdl } from './ProgramNode';

export type IdlInput = string | Partial<Idl>;
export type KinobiVersion = `${number}.${number}.${number}`;

export interface RootNode<
  TProgram extends ProgramNode = ProgramNode,
  TAdditionalPrograms extends ProgramNode[] = ProgramNode[],
> {
  readonly kind: 'rootNode';

  // Children.
  readonly program: TProgram;
  readonly additionalPrograms: TAdditionalPrograms;

  // Data.
  readonly standard: 'kinobi';
  readonly version: KinobiVersion;
}

export function rootNode<
  TProgram extends ProgramNode,
  const TAdditionalPrograms extends ProgramNode[] = [],
>(
  program: TProgram,
  additionalPrograms?: TAdditionalPrograms
): RootNode<TProgram, TAdditionalPrograms> {
  return {
    kind: 'rootNode',
    program,
    additionalPrograms: (additionalPrograms ?? []) as TAdditionalPrograms,
    standard: 'kinobi',
    // TODO: Replace with __VERSION__ variable when available.
    version: '0.19.0',
  };
}

export function rootNodeFromIdls(
  program: IdlInput,
  additionalPrograms: IdlInput[]
): RootNode {
  const resolveIdl = (idl: IdlInput) =>
    typeof idl === 'string' ? readJson<Partial<Idl>>(idl) : idl;
  const programNode = programNodeFromIdl(resolveIdl(program));
  const additionalProgramNodes = additionalPrograms
    .map(resolveIdl)
    .map(programNodeFromIdl);
  return rootNode(programNode, additionalProgramNodes);
}

export function getAllPrograms(node: RootNode): ProgramNode[] {
  return [node.program, ...node.additionalPrograms];
}

export function getAllPdas(node: RootNode): PdaNode[] {
  return getAllPrograms(node).flatMap((program) => program.pdas);
}

export function getAllAccounts(node: RootNode): AccountNode[] {
  return getAllPrograms(node).flatMap((program) => program.accounts);
}

export function getAllDefinedTypes(node: RootNode): DefinedTypeNode[] {
  return getAllPrograms(node).flatMap((program) => program.definedTypes);
}

export function getAllInstructions(node: RootNode): InstructionNode[] {
  return getAllPrograms(node).flatMap((program) => program.instructions);
}

export function getAllErrors(node: RootNode): ErrorNode[] {
  return getAllPrograms(node).flatMap((program) => program.errors);
}
