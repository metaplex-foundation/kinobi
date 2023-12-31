import type { Idl } from '../idl';
import { readJson } from '../shared';
import type { AccountNode } from './AccountNode';
import type { DefinedTypeNode } from './DefinedTypeNode';
import type { ErrorNode } from './ErrorNode';
import type { InstructionNode } from './InstructionNode';
import { ProgramNode, programNodeFromIdl } from './ProgramNode';

export type IdlInputs = string | Partial<Idl> | (string | Partial<Idl>)[];

export type RootNode = {
  readonly kind: 'rootNode';
  readonly programs: ProgramNode[];
};

export function rootNode(programs: ProgramNode[]): RootNode {
  return { kind: 'rootNode', programs };
}

export function rootNodeFromIdls(idls: IdlInputs): RootNode {
  const idlArray = Array.isArray(idls) ? idls : [idls];
  const programs = idlArray
    .map((idl) => (typeof idl === 'string' ? readJson<Partial<Idl>>(idl) : idl))
    .map((idl) => programNodeFromIdl(idl));
  return rootNode(programs);
}

export function getAllAccounts(node: RootNode): AccountNode[] {
  return node.programs.flatMap((program) => program.accounts);
}

export function getAllDefinedTypes(node: RootNode): DefinedTypeNode[] {
  return node.programs.flatMap((program) => program.definedTypes);
}

export function getAllInstructions(node: RootNode): InstructionNode[] {
  return node.programs.flatMap((program) => program.instructions);
}

export function getAllErrors(node: RootNode): ErrorNode[] {
  return node.programs.flatMap((program) => program.errors);
}
