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
  i64,
  mapSerializer,
  string,
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import { addAccountMeta, addObjectProperty } from '../shared';

// Accounts.
export type CreateFrequencyRuleInstructionAccounts = {
  /** Payer and creator of the Frequency Rule */
  payer?: Signer;
  /** The PDA account where the Frequency Rule is stored */
  frequencyPda: PublicKey | Pda;
  /** System program */
  systemProgram?: PublicKey | Pda;
};

// Data.
export type CreateFrequencyRuleInstructionData = {
  discriminator: number;
  ruleSetName: string;
  freqRuleName: string;
  lastUpdate: bigint;
  period: bigint;
};

export type CreateFrequencyRuleInstructionDataArgs = {
  ruleSetName: string;
  freqRuleName: string;
  lastUpdate: number | bigint;
  period: number | bigint;
};

export function getCreateFrequencyRuleInstructionDataSerializer(
  _context: object = {}
): Serializer<
  CreateFrequencyRuleInstructionDataArgs,
  CreateFrequencyRuleInstructionData
> {
  return mapSerializer<
    CreateFrequencyRuleInstructionDataArgs,
    any,
    CreateFrequencyRuleInstructionData
  >(
    struct<CreateFrequencyRuleInstructionData>(
      [
        ['discriminator', u8()],
        ['ruleSetName', string()],
        ['freqRuleName', string()],
        ['lastUpdate', i64()],
        ['period', i64()],
      ],
      { description: 'CreateFrequencyRuleInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 2 })
  ) as Serializer<
    CreateFrequencyRuleInstructionDataArgs,
    CreateFrequencyRuleInstructionData
  >;
}

// Args.
export type CreateFrequencyRuleInstructionArgs =
  CreateFrequencyRuleInstructionDataArgs;

// Instruction.
export function createFrequencyRule(
  context: Pick<Context, 'serializer' | 'programs' | 'payer'>,
  input: CreateFrequencyRuleInstructionAccounts &
    CreateFrequencyRuleInstructionArgs
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
    frequencyPda: [input.frequencyPda, true] as const,
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
  const resolvedArgs = { ...input, ...resolvingArgs };

  addAccountMeta(keys, signers, resolvedAccounts.payer, false);
  addAccountMeta(keys, signers, resolvedAccounts.frequencyPda, false);
  addAccountMeta(keys, signers, resolvedAccounts.systemProgram, false);

  // Data.
  const data =
    getCreateFrequencyRuleInstructionDataSerializer(context).serialize(
      resolvedArgs
    );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
