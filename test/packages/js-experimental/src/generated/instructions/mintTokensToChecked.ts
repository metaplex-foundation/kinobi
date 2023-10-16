/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

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
  getU64Decoder,
  getU64Encoder,
  getU8Decoder,
  getU8Encoder,
} from '@solana/codecs-numbers';
import {
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  ReadonlySignerAccount,
  WritableAccount,
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
export type MintTokensToCheckedInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMint extends string = string,
  TAccountToken extends string = string,
  TAccountMintAuthority extends string = string
> = IInstruction<TProgram> &
  IInstructionWithData<MintTokensToCheckedInstructionData> &
  IInstructionWithAccounts<
    [
      WritableAccount<TAccountMint>,
      WritableAccount<TAccountToken>,
      ReadonlySignerAccount<TAccountMintAuthority>
    ]
  >;

export type MintTokensToCheckedInstructionData = {
  discriminator: number;
  amount: bigint;
  decimals: number;
};

export type MintTokensToCheckedInstructionDataArgs = {
  amount: number | bigint;
  decimals: number;
};

export function getMintTokensToCheckedInstructionDataEncoder(): Encoder<MintTokensToCheckedInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<MintTokensToCheckedInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['amount', getU64Encoder()],
        ['decimals', getU8Encoder()],
      ],
      { description: 'MintTokensToCheckedInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 14 } as MintTokensToCheckedInstructionData)
  ) as Encoder<MintTokensToCheckedInstructionDataArgs>;
}

export function getMintTokensToCheckedInstructionDataDecoder(): Decoder<MintTokensToCheckedInstructionData> {
  return getStructDecoder<MintTokensToCheckedInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['amount', getU64Decoder()],
      ['decimals', getU8Decoder()],
    ],
    { description: 'MintTokensToCheckedInstructionData' }
  ) as Decoder<MintTokensToCheckedInstructionData>;
}

export function getMintTokensToCheckedInstructionDataCodec(): Codec<
  MintTokensToCheckedInstructionDataArgs,
  MintTokensToCheckedInstructionData
> {
  return combineCodec(
    getMintTokensToCheckedInstructionDataEncoder(),
    getMintTokensToCheckedInstructionDataDecoder()
  );
}
