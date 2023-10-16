/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { address } from '@solana/addresses';
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
import { getU8Decoder, getU8Encoder } from '@solana/codecs-numbers';
import {
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  ReadonlyAccount,
  ReadonlySignerAccount,
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
import {
  CreateMasterEditionArgs,
  CreateMasterEditionArgsArgs,
  getCreateMasterEditionArgsDecoder,
  getCreateMasterEditionArgsEncoder,
} from '../types';

// Output.
export type CreateMasterEditionInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountEdition extends string = string,
  TAccountMint extends string = string,
  TAccountUpdateAuthority extends string = string,
  TAccountMintAuthority extends string = string,
  TAccountPayer extends string = string,
  TAccountMetadata extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountRent extends string = 'SysvarRent111111111111111111111111111111111'
> = IInstruction<TProgram> &
  IInstructionWithData<CreateMasterEditionInstructionData> &
  IInstructionWithAccounts<
    [
      WritableAccount<TAccountEdition>,
      WritableAccount<TAccountMint>,
      ReadonlySignerAccount<TAccountUpdateAuthority>,
      ReadonlySignerAccount<TAccountMintAuthority>,
      WritableSignerAccount<TAccountPayer>,
      ReadonlyAccount<TAccountMetadata>,
      ReadonlyAccount<TAccountTokenProgram>,
      ReadonlyAccount<TAccountSystemProgram>,
      ReadonlyAccount<TAccountRent>
    ]
  >;

export type CreateMasterEditionInstructionData = {
  discriminator: number;
  createMasterEditionArgs: CreateMasterEditionArgs;
};

export type CreateMasterEditionInstructionDataArgs = {
  createMasterEditionArgs: CreateMasterEditionArgsArgs;
};

export function getCreateMasterEditionInstructionDataEncoder(): Encoder<CreateMasterEditionInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<CreateMasterEditionInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['createMasterEditionArgs', getCreateMasterEditionArgsEncoder()],
      ],
      { description: 'CreateMasterEditionInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 10 } as CreateMasterEditionInstructionData)
  ) as Encoder<CreateMasterEditionInstructionDataArgs>;
}

export function getCreateMasterEditionInstructionDataDecoder(): Decoder<CreateMasterEditionInstructionData> {
  return getStructDecoder<CreateMasterEditionInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['createMasterEditionArgs', getCreateMasterEditionArgsDecoder()],
    ],
    { description: 'CreateMasterEditionInstructionData' }
  ) as Decoder<CreateMasterEditionInstructionData>;
}

export function getCreateMasterEditionInstructionDataCodec(): Codec<
  CreateMasterEditionInstructionDataArgs,
  CreateMasterEditionInstructionData
> {
  return combineCodec(
    getCreateMasterEditionInstructionDataEncoder(),
    getCreateMasterEditionInstructionDataDecoder()
  );
}
