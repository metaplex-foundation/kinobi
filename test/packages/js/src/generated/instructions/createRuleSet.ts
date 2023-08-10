/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  AccountMeta,
  Context,
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  mapSerializer,
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import { PickPartial, addAccountMeta, addObjectProperty } from '../shared';
import {
  TaCreateArgs,
  TaCreateArgsArgs,
  getTaCreateArgsSerializer,
} from '../types';

// Accounts.
export type CreateRuleSetInstructionAccounts = {
  /** Payer and creator of the RuleSet */
  payer?: Signer;
  /** The PDA account where the RuleSet is stored */
  ruleSetPda: Pda;
  /** System program */
  systemProgram?: PublicKey | Pda;
};

// Data.
export type CreateRuleSetInstructionData = {
  discriminator: number;
  createArgs: TaCreateArgs;
  ruleSetBump: number;
};

export type CreateRuleSetInstructionDataArgs = {
  createArgs: TaCreateArgsArgs;
  ruleSetBump: number;
};

/** @deprecated Use `getCreateRuleSetInstructionDataSerializer()` without any argument instead. */
export function getCreateRuleSetInstructionDataSerializer(
  _context: object
): Serializer<CreateRuleSetInstructionDataArgs, CreateRuleSetInstructionData>;
export function getCreateRuleSetInstructionDataSerializer(): Serializer<
  CreateRuleSetInstructionDataArgs,
  CreateRuleSetInstructionData
>;
export function getCreateRuleSetInstructionDataSerializer(
  _context: object = {}
): Serializer<CreateRuleSetInstructionDataArgs, CreateRuleSetInstructionData> {
  return mapSerializer<
    CreateRuleSetInstructionDataArgs,
    any,
    CreateRuleSetInstructionData
  >(
    struct<CreateRuleSetInstructionData>(
      [
        ['discriminator', u8()],
        ['createArgs', getTaCreateArgsSerializer()],
        ['ruleSetBump', u8()],
      ],
      { description: 'CreateRuleSetInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 0 })
  ) as Serializer<
    CreateRuleSetInstructionDataArgs,
    CreateRuleSetInstructionData
  >;
}

// Args.
export type CreateRuleSetInstructionArgs = PickPartial<
  CreateRuleSetInstructionDataArgs,
  'ruleSetBump'
>;

// Instruction.
export function createRuleSet(
  context: Pick<Context, 'programs' | 'payer'>,
  input: CreateRuleSetInstructionAccounts & CreateRuleSetInstructionArgs
): TransactionBuilder {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplTokenAuthRules',
    'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg'
  );

  // Resolved inputs.
  const resolvedAccounts = {
    ruleSetPda: [input.ruleSetPda, true] as const,
  };
  const resolvingArgs = {};
  addObjectProperty(
    resolvedAccounts,
    'payer',
    input.payer
      ? ([input.payer, true] as const)
      : ([context.payer, true] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'systemProgram',
    input.systemProgram
      ? ([input.systemProgram, false] as const)
      : ([
          context.programs.getPublicKey(
            'splSystem',
            '11111111111111111111111111111111'
          ),
          false,
        ] as const)
  );
  addObjectProperty(
    resolvingArgs,
    'ruleSetBump',
    input.ruleSetBump ?? input.ruleSetPda[1]
  );
  const resolvedArgs = { ...input, ...resolvingArgs };

  addAccountMeta(keys, signers, resolvedAccounts.payer, false);
  addAccountMeta(keys, signers, resolvedAccounts.ruleSetPda, false);
  addAccountMeta(keys, signers, resolvedAccounts.systemProgram, false);

  // Data.
  const data =
    getCreateRuleSetInstructionDataSerializer().serialize(resolvedArgs);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}