/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Base58EncodedAddress } from '@solana/addresses';
import {
  Codec,
  Decoder,
  Encoder,
  combineCodec,
  mapEncoder,
} from '@solana/codecs-core';
import {
  getStructDecoder,
  getStructEncoder,
} from '@solana/codecs-data-structures';
import {
  getI64Decoder,
  getI64Encoder,
  getU8Decoder,
  getU8Encoder,
} from '@solana/codecs-numbers';
import { getStringDecoder, getStringEncoder } from '@solana/codecs-strings';
import {
  AccountRole,
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  ReadonlyAccount,
  WritableAccount,
  WritableSignerAccount,
} from '@solana/instructions';
import {
  Context,
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  transactionBuilder,
} from 'umi';
import { Serializer } from 'umiSerializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';

// Output.
export type CreateFrequencyRuleInstruction<
  TProgram extends string = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg',
  TAccountPayer extends string = string,
  TAccountFrequencyPda extends string = string,
  TAccountSystemProgram extends string = '11111111111111111111111111111111'
> = IInstruction<TProgram> &
  IInstructionWithData<CreateFrequencyRuleInstructionData> &
  IInstructionWithAccounts<
    [
      WritableSignerAccount<TAccountPayer>,
      WritableAccount<TAccountFrequencyPda>,
      ReadonlyAccount<TAccountSystemProgram>
    ]
  >;

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

export function getCreateFrequencyRuleInstructionDataEncoder(): Encoder<CreateFrequencyRuleInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<CreateFrequencyRuleInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['ruleSetName', getStringEncoder()],
        ['freqRuleName', getStringEncoder()],
        ['lastUpdate', getI64Encoder()],
        ['period', getI64Encoder()],
      ],
      { description: 'CreateFrequencyRuleInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 2 } as CreateFrequencyRuleInstructionData)
  ) as Encoder<CreateFrequencyRuleInstructionDataArgs>;
}

export function getCreateFrequencyRuleInstructionDataDecoder(): Decoder<CreateFrequencyRuleInstructionData> {
  return getStructDecoder<CreateFrequencyRuleInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['ruleSetName', getStringDecoder()],
      ['freqRuleName', getStringDecoder()],
      ['lastUpdate', getI64Decoder()],
      ['period', getI64Decoder()],
    ],
    { description: 'CreateFrequencyRuleInstructionData' }
  ) as Decoder<CreateFrequencyRuleInstructionData>;
}

export function getCreateFrequencyRuleInstructionDataCodec(): Codec<
  CreateFrequencyRuleInstructionDataArgs,
  CreateFrequencyRuleInstructionData
> {
  return combineCodec(
    getCreateFrequencyRuleInstructionDataEncoder(),
    getCreateFrequencyRuleInstructionDataDecoder()
  );
}

export function createFrequencyRuleInstruction<
  TProgram extends string = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg',
  TAccountPayer extends string = string,
  TAccountFrequencyPda extends string = string,
  TAccountSystemProgram extends string = '11111111111111111111111111111111'
>(
  accounts: {
    payer: Base58EncodedAddress<TAccountPayer>;
    frequencyPda: Base58EncodedAddress<TAccountFrequencyPda>;
    systemProgram: Base58EncodedAddress<TAccountSystemProgram>;
  },
  args: CreateFrequencyRuleInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg' as Base58EncodedAddress<TProgram>
): CreateFrequencyRuleInstruction<
  TProgram,
  TAccountPayer,
  TAccountFrequencyPda,
  TAccountSystemProgram
> {
  return {
    accounts: [
      { address: accounts.payer, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.frequencyPda, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.systemProgram, role: AccountRole.WRITABLE_SIGNER },
    ],
    data: getCreateFrequencyRuleInstructionDataEncoder().encode(args),
    programAddress,
  };
}
