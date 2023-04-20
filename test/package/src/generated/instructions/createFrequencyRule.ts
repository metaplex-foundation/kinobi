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
  PublicKey,
  Serializer,
  Signer,
  TransactionBuilder,
  checkForIsWritableOverride as isWritable,
  mapSerializer,
  transactionBuilder,
} from '@metaplex-foundation/umi';

// Accounts.
export type CreateFrequencyRuleInstructionAccounts = {
  /** Payer and creator of the Frequency Rule */
  payer?: Signer;
  /** The PDA account where the Frequency Rule is stored */
  frequencyPda: PublicKey;
  /** System program */
  systemProgram?: PublicKey;
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
  context: Pick<Context, 'serializer'>
): Serializer<
  CreateFrequencyRuleInstructionDataArgs,
  CreateFrequencyRuleInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    CreateFrequencyRuleInstructionDataArgs,
    CreateFrequencyRuleInstructionData,
    CreateFrequencyRuleInstructionData
  >(
    s.struct<CreateFrequencyRuleInstructionData>(
      [
        ['discriminator', s.u8()],
        ['ruleSetName', s.string()],
        ['freqRuleName', s.string()],
        ['lastUpdate', s.i64()],
        ['period', s.i64()],
      ],
      { description: 'CreateFrequencyRuleInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 2 } as CreateFrequencyRuleInstructionData)
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
  const programId = {
    ...context.programs.getPublicKey(
      'mplTokenAuthRules',
      'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg'
    ),
    isWritable: false,
  };

  // Resolved inputs.
  const resolvedAccounts: any = { ...input };
  const resolvedArgs: any = { ...input };
  resolvedAccounts.payer = resolvedAccounts.payer ?? context.payer;
  resolvedAccounts.systemProgram = resolvedAccounts.systemProgram ?? {
    ...context.programs.getPublicKey(
      'splSystem',
      '11111111111111111111111111111111'
    ),
    isWritable: false,
  };

  // Payer.
  signers.push(resolvedAccounts.payer);
  keys.push({
    pubkey: resolvedAccounts.payer.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.payer, true),
  });

  // Frequency Pda.
  keys.push({
    pubkey: resolvedAccounts.frequencyPda,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.frequencyPda, true),
  });

  // System Program.
  keys.push({
    pubkey: resolvedAccounts.systemProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.systemProgram, false),
  });

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
