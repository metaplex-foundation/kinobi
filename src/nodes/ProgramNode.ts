import type { Idl } from '../idl';
import { PartialExcept, mainCase } from '../shared';
import { AccountNode, accountNodeFromIdl } from './AccountNode';
import { DefinedTypeNode, definedTypeNodeFromIdl } from './DefinedTypeNode';
import { ErrorNode, errorNodeFromIdl } from './ErrorNode';
import { InstructionNode, instructionNodeFromIdl } from './InstructionNode';
import type { Node } from './Node';

export type ProgramNode = {
  readonly __programNode: unique symbol;
  readonly kind: 'programNode';
  readonly accounts: AccountNode[];
  readonly instructions: InstructionNode[];
  readonly definedTypes: DefinedTypeNode[];
  readonly errors: ErrorNode[];
  readonly name: string;
  readonly prefix: string;
  readonly publicKey: string;
  readonly version: string;
  readonly origin?: 'shank' | 'anchor';
  readonly internal: boolean;
};

export type ProgramNodeInput = Omit<
  PartialExcept<
    ProgramNode,
    | 'accounts'
    | 'instructions'
    | 'definedTypes'
    | 'errors'
    | 'name'
    | 'publicKey'
    | 'version'
  >,
  '__programNode' | 'kind'
>;

export function programNode(input: ProgramNodeInput): ProgramNode {
  return {
    kind: 'programNode',
    accounts: input.accounts,
    instructions: input.instructions,
    definedTypes: input.definedTypes,
    errors: input.errors,
    name: mainCase(input.name),
    prefix: mainCase(input.prefix ?? ''),
    publicKey: input.publicKey,
    version: input.version,
    origin: input.origin,
    internal: input.internal ?? false,
  } as ProgramNode;
}

export function programNodeFromIdl(idl: Partial<Idl>): ProgramNode {
  const origin = idl.metadata?.origin;
  const accounts = (idl.accounts ?? []).map(accountNodeFromIdl);
  const instructions = (idl.instructions ?? []).map((ix) =>
    origin === 'anchor'
      ? instructionNodeFromIdl({
          ...ix,
          defaultOptionalAccounts: ix.defaultOptionalAccounts ?? true,
        })
      : instructionNodeFromIdl(ix)
  );
  return programNode({
    accounts,
    instructions,
    definedTypes: (idl.types ?? []).map(definedTypeNodeFromIdl),
    errors: (idl.errors ?? []).map(errorNodeFromIdl),
    name: idl.name ?? '',
    publicKey: idl.metadata?.address ?? '',
    version: idl.version ?? '',
    origin,
  });
}

export function isProgramNode(node: Node | null): node is ProgramNode {
  return !!node && node.kind === 'programNode';
}

export function assertProgramNode(
  node: Node | null
): asserts node is ProgramNode {
  if (!isProgramNode(node)) {
    throw new Error(`Expected ProgramNode, got ${node?.kind ?? 'null'}.`);
  }
}
