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
export type ApproveUseAuthorityInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountUseAuthorityRecord extends string = string,
  TAccountOwner extends string = string,
  TAccountPayer extends string = string,
  TAccountUser extends string = string,
  TAccountOwnerTokenAccount extends string = string,
  TAccountMetadata extends string = string,
  TAccountMint extends string = string,
  TAccountBurner extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountRent extends string = string
> = IInstruction<TProgram> &
  IInstructionWithData<ApproveUseAuthorityInstructionData> &
  IInstructionWithAccounts<
    [
      WritableAccount<TAccountUseAuthorityRecord>,
      WritableSignerAccount<TAccountOwner>,
      WritableSignerAccount<TAccountPayer>,
      ReadonlyAccount<TAccountUser>,
      WritableAccount<TAccountOwnerTokenAccount>,
      ReadonlyAccount<TAccountMetadata>,
      ReadonlyAccount<TAccountMint>,
      ReadonlyAccount<TAccountBurner>,
      ReadonlyAccount<TAccountTokenProgram>,
      ReadonlyAccount<TAccountSystemProgram>,
      ReadonlyAccount<TAccountRent>
    ]
  >;

export type ApproveUseAuthorityInstructionData = {
  discriminator: number;
  numberOfUses: bigint;
};

export type ApproveUseAuthorityInstructionDataArgs = {
  numberOfUses: number | bigint;
};

export function getApproveUseAuthorityInstructionDataEncoder(): Encoder<ApproveUseAuthorityInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<ApproveUseAuthorityInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['numberOfUses', getU64Encoder()],
      ],
      { description: 'ApproveUseAuthorityInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 20 } as ApproveUseAuthorityInstructionData)
  ) as Encoder<ApproveUseAuthorityInstructionDataArgs>;
}

export function getApproveUseAuthorityInstructionDataDecoder(): Decoder<ApproveUseAuthorityInstructionData> {
  return getStructDecoder<ApproveUseAuthorityInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['numberOfUses', getU64Decoder()],
    ],
    { description: 'ApproveUseAuthorityInstructionData' }
  ) as Decoder<ApproveUseAuthorityInstructionData>;
}

export function getApproveUseAuthorityInstructionDataCodec(): Codec<
  ApproveUseAuthorityInstructionDataArgs,
  ApproveUseAuthorityInstructionData
> {
  return combineCodec(
    getApproveUseAuthorityInstructionDataEncoder(),
    getApproveUseAuthorityInstructionDataDecoder()
  );
}
