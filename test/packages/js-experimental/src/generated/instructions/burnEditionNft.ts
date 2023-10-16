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
import { getU8Decoder, getU8Encoder } from '@solana/codecs-numbers';
import {
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
export type BurnEditionNftInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string,
  TAccountOwner extends string = string,
  TAccountPrintEditionMint extends string = string,
  TAccountMasterEditionMint extends string = string,
  TAccountPrintEditionTokenAccount extends string = string,
  TAccountMasterEditionTokenAccount extends string = string,
  TAccountMasterEditionAccount extends string = string,
  TAccountPrintEditionAccount extends string = string,
  TAccountEditionMarkerAccount extends string = string,
  TAccountSplTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
> = IInstruction<TProgram> &
  IInstructionWithData<BurnEditionNftInstructionData> &
  IInstructionWithAccounts<
    [
      WritableAccount<TAccountMetadata>,
      WritableSignerAccount<TAccountOwner>,
      WritableAccount<TAccountPrintEditionMint>,
      ReadonlyAccount<TAccountMasterEditionMint>,
      WritableAccount<TAccountPrintEditionTokenAccount>,
      ReadonlyAccount<TAccountMasterEditionTokenAccount>,
      WritableAccount<TAccountMasterEditionAccount>,
      WritableAccount<TAccountPrintEditionAccount>,
      WritableAccount<TAccountEditionMarkerAccount>,
      ReadonlyAccount<TAccountSplTokenProgram>
    ]
  >;

export type BurnEditionNftInstructionData = { discriminator: number };

export type BurnEditionNftInstructionDataArgs = {};

export function getBurnEditionNftInstructionDataEncoder(): Encoder<BurnEditionNftInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<BurnEditionNftInstructionData>(
      [['discriminator', getU8Encoder()]],
      { description: 'BurnEditionNftInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 37 } as BurnEditionNftInstructionData)
  ) as Encoder<BurnEditionNftInstructionDataArgs>;
}

export function getBurnEditionNftInstructionDataDecoder(): Decoder<BurnEditionNftInstructionData> {
  return getStructDecoder<BurnEditionNftInstructionData>(
    [['discriminator', getU8Decoder()]],
    { description: 'BurnEditionNftInstructionData' }
  ) as Decoder<BurnEditionNftInstructionData>;
}

export function getBurnEditionNftInstructionDataCodec(): Codec<
  BurnEditionNftInstructionDataArgs,
  BurnEditionNftInstructionData
> {
  return combineCodec(
    getBurnEditionNftInstructionDataEncoder(),
    getBurnEditionNftInstructionDataDecoder()
  );
}
