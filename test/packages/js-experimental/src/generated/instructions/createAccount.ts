/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Base58EncodedAddress,
  getAddressDecoder,
  getAddressEncoder,
} from '@solana/addresses';
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
  getU32Decoder,
  getU32Encoder,
  getU64Decoder,
  getU64Encoder,
} from '@solana/codecs-numbers';
import {
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  WritableSignerAccount,
} from '@solana/instructions';
import { Context, Signer, TransactionBuilder, transactionBuilder } from 'umi';
import { Serializer } from 'umiSerializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';

// Output.
export type CreateAccountInstruction<
  TProgram extends string = '11111111111111111111111111111111',
  TAccountPayer extends string = string,
  TAccountNewAccount extends string = string
> = IInstruction<TProgram> &
  IInstructionWithData<CreateAccountInstructionData> &
  IInstructionWithAccounts<
    [
      WritableSignerAccount<TAccountPayer>,
      WritableSignerAccount<TAccountNewAccount>
    ]
  >;

export type CreateAccountInstructionData = {
  discriminator: number;
  lamports: bigint;
  space: bigint;
  programId: Base58EncodedAddress;
};

export type CreateAccountInstructionDataArgs = {
  lamports: number | bigint;
  space: number | bigint;
  programId: Base58EncodedAddress;
};

export function getCreateAccountInstructionDataEncoder(): Encoder<CreateAccountInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<CreateAccountInstructionData>(
      [
        ['discriminator', getU32Encoder()],
        ['lamports', getU64Encoder()],
        ['space', getU64Encoder()],
        ['programId', getAddressEncoder()],
      ],
      { description: 'CreateAccountInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 0 } as CreateAccountInstructionData)
  ) as Encoder<CreateAccountInstructionDataArgs>;
}

export function getCreateAccountInstructionDataDecoder(): Decoder<CreateAccountInstructionData> {
  return getStructDecoder<CreateAccountInstructionData>(
    [
      ['discriminator', getU32Decoder()],
      ['lamports', getU64Decoder()],
      ['space', getU64Decoder()],
      ['programId', getAddressDecoder()],
    ],
    { description: 'CreateAccountInstructionData' }
  ) as Decoder<CreateAccountInstructionData>;
}

export function getCreateAccountInstructionDataCodec(): Codec<
  CreateAccountInstructionDataArgs,
  CreateAccountInstructionData
> {
  return combineCodec(
    getCreateAccountInstructionDataEncoder(),
    getCreateAccountInstructionDataDecoder()
  );
}
