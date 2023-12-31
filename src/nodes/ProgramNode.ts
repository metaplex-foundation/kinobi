import type { Idl } from '../idl';
import { MainCaseString, PartialExcept, mainCase } from '../shared';
import { AccountNode, accountNodeFromIdl } from './AccountNode';
import { DefinedTypeNode, definedTypeNodeFromIdl } from './DefinedTypeNode';
import { ErrorNode, errorNodeFromIdl } from './ErrorNode';
import { InstructionNode, instructionNodeFromIdl } from './InstructionNode';
import { PdaNode, pdaNodeFromIdl } from './PdaNode';

export type ProgramNode = {
  readonly kind: 'programNode';

  // Children.
  readonly pdas: PdaNode[];
  readonly accounts: AccountNode[];
  readonly instructions: InstructionNode[];
  readonly definedTypes: DefinedTypeNode[];
  readonly errors: ErrorNode[];

  // Data.
  readonly name: MainCaseString;
  readonly prefix: MainCaseString;
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
    | 'publicKey'
    | 'version'
  >,
  'kind' | 'name' | 'prefix'
> & {
  readonly name: string;
  readonly prefix?: string;
};

export function programNode(input: ProgramNodeInput): ProgramNode {
  return {
    kind: 'programNode',
    pdas: input.pdas ?? [],
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
  };
}

export function programNodeFromIdl(idl: Partial<Idl>): ProgramNode {
  const origin = idl.metadata?.origin;
  const pdas = (idl.accounts ?? []).map(pdaNodeFromIdl);
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
    pdas,
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
