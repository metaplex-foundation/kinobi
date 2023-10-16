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
export type UtilizeInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string,
  TAccountTokenAccount extends string = string,
  TAccountMint extends string = string,
  TAccountUseAuthority extends string = string,
  TAccountOwner extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAtaProgram extends string = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountRent extends string = 'SysvarRent111111111111111111111111111111111',
  TAccountUseAuthorityRecord extends string = string,
  TAccountBurner extends string = string
> = IInstruction<TProgram> &
  IInstructionWithData<UtilizeInstructionData> &
  IInstructionWithAccounts<
    [
      WritableAccount<TAccountMetadata>,
      WritableAccount<TAccountTokenAccount>,
      WritableAccount<TAccountMint>,
      WritableSignerAccount<TAccountUseAuthority>,
      ReadonlyAccount<TAccountOwner>,
      ReadonlyAccount<TAccountTokenProgram>,
      ReadonlyAccount<TAccountAtaProgram>,
      ReadonlyAccount<TAccountSystemProgram>,
      ReadonlyAccount<TAccountRent>,
      WritableAccount<TAccountUseAuthorityRecord>,
      ReadonlyAccount<TAccountBurner>
    ]
  >;

export type UtilizeInstructionData = {
  discriminator: number;
  numberOfUses: bigint;
};

export type UtilizeInstructionDataArgs = { numberOfUses: number | bigint };

export function getUtilizeInstructionDataEncoder(): Encoder<UtilizeInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<UtilizeInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['numberOfUses', getU64Encoder()],
      ],
      { description: 'UtilizeInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 19 } as UtilizeInstructionData)
  ) as Encoder<UtilizeInstructionDataArgs>;
}

export function getUtilizeInstructionDataDecoder(): Decoder<UtilizeInstructionData> {
  return getStructDecoder<UtilizeInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['numberOfUses', getU64Decoder()],
    ],
    { description: 'UtilizeInstructionData' }
  ) as Decoder<UtilizeInstructionData>;
}

export function getUtilizeInstructionDataCodec(): Codec<
  UtilizeInstructionDataArgs,
  UtilizeInstructionData
> {
  return combineCodec(
    getUtilizeInstructionDataEncoder(),
    getUtilizeInstructionDataDecoder()
  );
}
