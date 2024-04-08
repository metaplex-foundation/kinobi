import type { Idl } from '../idl';
import { MainCaseString, PartialExcept, mainCase } from '../shared';
import { AccountNode, accountNodeFromIdl } from './AccountNode';
import { DefinedTypeNode, definedTypeNodeFromIdl } from './DefinedTypeNode';
import { ErrorNode, errorNodeFromIdl } from './ErrorNode';
import { InstructionNode, instructionNodeFromIdl } from './InstructionNode';
import { PdaNode, pdaNodeFromIdl } from './PdaNode';

export interface ProgramNode<
  TPdas extends PdaNode[] = PdaNode[],
  TAccounts extends AccountNode[] = AccountNode[],
  TInstructions extends InstructionNode[] = InstructionNode[],
  TDefinedTypes extends DefinedTypeNode[] = DefinedTypeNode[],
  TErrors extends ErrorNode[] = ErrorNode[],
> {
  readonly kind: 'programNode';

  // Children.
  readonly pdas: TPdas;
  readonly accounts: TAccounts;
  readonly instructions: TInstructions;
  readonly definedTypes: TDefinedTypes;
  readonly errors: TErrors;

  // Data.
  readonly name: MainCaseString;
  readonly prefix: MainCaseString;
  readonly publicKey: string;
  readonly version: string;
  readonly origin?: 'shank' | 'anchor';
}

export type ProgramNodeInput<
  TPdas extends PdaNode[] = PdaNode[],
  TAccounts extends AccountNode[] = AccountNode[],
  TInstructions extends InstructionNode[] = InstructionNode[],
  TDefinedTypes extends DefinedTypeNode[] = DefinedTypeNode[],
  TErrors extends ErrorNode[] = ErrorNode[],
> = Omit<
  PartialExcept<
    ProgramNode<TPdas, TAccounts, TInstructions, TDefinedTypes, TErrors>,
    'publicKey'
  >,
  'kind' | 'name' | 'prefix'
> & {
  readonly name: string;
  readonly prefix?: string;
};

export function programNode<
  const TPdas extends PdaNode[] = [],
  const TAccounts extends AccountNode[] = [],
  const TInstructions extends InstructionNode[] = [],
  const TDefinedTypes extends DefinedTypeNode[] = [],
  const TErrors extends ErrorNode[] = [],
>(
  input: ProgramNodeInput<
    TPdas,
    TAccounts,
    TInstructions,
    TDefinedTypes,
    TErrors
  >
): ProgramNode<TPdas, TAccounts, TInstructions, TDefinedTypes, TErrors> {
  return {
    kind: 'programNode',
    pdas: (input.pdas ?? []) as TPdas,
    accounts: (input.accounts ?? []) as TAccounts,
    instructions: (input.instructions ?? []) as TInstructions,
    definedTypes: (input.definedTypes ?? []) as TDefinedTypes,
    errors: (input.errors ?? []) as TErrors,
    name: mainCase(input.name),
    prefix: mainCase(input.prefix ?? ''),
    publicKey: input.publicKey,
    version: input.version ?? '',
    origin: input.origin,
  };
}

export function programNodeFromIdl(idl: Partial<Idl>): ProgramNode {
  const origin = idl.metadata?.origin;
  const pdas = (idl.accounts ?? [])
    .filter((account) => (account.seeds ?? []).length > 0)
    .map(pdaNodeFromIdl);
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
