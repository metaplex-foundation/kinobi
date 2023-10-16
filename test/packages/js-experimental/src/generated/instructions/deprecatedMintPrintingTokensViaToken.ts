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
  MintPrintingTokensViaTokenArgs,
  MintPrintingTokensViaTokenArgsArgs,
  getMintPrintingTokensViaTokenArgsDecoder,
  getMintPrintingTokensViaTokenArgsEncoder,
} from '../types';

// Output.
export type DeprecatedMintPrintingTokensViaTokenInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountDestination extends string = string,
  TAccountToken extends string = string,
  TAccountOneTimePrintingAuthorizationMint extends string = string,
  TAccountPrintingMint extends string = string,
  TAccountBurnAuthority extends string = string,
  TAccountMetadata extends string = string,
  TAccountMasterEdition extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountRent extends string = 'SysvarRent111111111111111111111111111111111'
> = IInstruction<TProgram> &
  IInstructionWithData<DeprecatedMintPrintingTokensViaTokenInstructionData> &
  IInstructionWithAccounts<
    [
      WritableAccount<TAccountDestination>,
      WritableAccount<TAccountToken>,
      WritableAccount<TAccountOneTimePrintingAuthorizationMint>,
      WritableAccount<TAccountPrintingMint>,
      ReadonlySignerAccount<TAccountBurnAuthority>,
      ReadonlyAccount<TAccountMetadata>,
      ReadonlyAccount<TAccountMasterEdition>,
      ReadonlyAccount<TAccountTokenProgram>,
      ReadonlyAccount<TAccountRent>
    ]
  >;

export type DeprecatedMintPrintingTokensViaTokenInstructionData = {
  discriminator: number;
  mintPrintingTokensViaTokenArgs: MintPrintingTokensViaTokenArgs;
};

export type DeprecatedMintPrintingTokensViaTokenInstructionDataArgs = {
  mintPrintingTokensViaTokenArgs: MintPrintingTokensViaTokenArgsArgs;
};

export function getDeprecatedMintPrintingTokensViaTokenInstructionDataEncoder(): Encoder<DeprecatedMintPrintingTokensViaTokenInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<DeprecatedMintPrintingTokensViaTokenInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        [
          'mintPrintingTokensViaTokenArgs',
          getMintPrintingTokensViaTokenArgsEncoder(),
        ],
      ],
      { description: 'DeprecatedMintPrintingTokensViaTokenInstructionData' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: 8,
      } as DeprecatedMintPrintingTokensViaTokenInstructionData)
  ) as Encoder<DeprecatedMintPrintingTokensViaTokenInstructionDataArgs>;
}

export function getDeprecatedMintPrintingTokensViaTokenInstructionDataDecoder(): Decoder<DeprecatedMintPrintingTokensViaTokenInstructionData> {
  return getStructDecoder<DeprecatedMintPrintingTokensViaTokenInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      [
        'mintPrintingTokensViaTokenArgs',
        getMintPrintingTokensViaTokenArgsDecoder(),
      ],
    ],
    { description: 'DeprecatedMintPrintingTokensViaTokenInstructionData' }
  ) as Decoder<DeprecatedMintPrintingTokensViaTokenInstructionData>;
}

export function getDeprecatedMintPrintingTokensViaTokenInstructionDataCodec(): Codec<
  DeprecatedMintPrintingTokensViaTokenInstructionDataArgs,
  DeprecatedMintPrintingTokensViaTokenInstructionData
> {
  return combineCodec(
    getDeprecatedMintPrintingTokensViaTokenInstructionDataEncoder(),
    getDeprecatedMintPrintingTokensViaTokenInstructionDataDecoder()
  );
}
