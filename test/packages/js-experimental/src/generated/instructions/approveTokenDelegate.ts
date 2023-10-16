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
export type ApproveTokenDelegateInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSource extends string = string,
  TAccountDelegate extends string = string,
  TAccountOwner extends string = string
> = IInstruction<TProgram> &
  IInstructionWithData<ApproveTokenDelegateInstructionData> &
  IInstructionWithAccounts<
    [
      WritableAccount<TAccountSource>,
      ReadonlyAccount<TAccountDelegate>,
      ReadonlySignerAccount<TAccountOwner>
    ]
  >;

export type ApproveTokenDelegateInstructionData = {
  discriminator: number;
  amount: bigint;
};

export type ApproveTokenDelegateInstructionDataArgs = {
  amount: number | bigint;
};

export function getApproveTokenDelegateInstructionDataEncoder(): Encoder<ApproveTokenDelegateInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<ApproveTokenDelegateInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['amount', getU64Encoder()],
      ],
      { description: 'ApproveTokenDelegateInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 4 } as ApproveTokenDelegateInstructionData)
  ) as Encoder<ApproveTokenDelegateInstructionDataArgs>;
}

export function getApproveTokenDelegateInstructionDataDecoder(): Decoder<ApproveTokenDelegateInstructionData> {
  return getStructDecoder<ApproveTokenDelegateInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['amount', getU64Decoder()],
    ],
    { description: 'ApproveTokenDelegateInstructionData' }
  ) as Decoder<ApproveTokenDelegateInstructionData>;
}

export function getApproveTokenDelegateInstructionDataCodec(): Codec<
  ApproveTokenDelegateInstructionDataArgs,
  ApproveTokenDelegateInstructionData
> {
  return combineCodec(
    getApproveTokenDelegateInstructionDataEncoder(),
    getApproveTokenDelegateInstructionDataDecoder()
  );
}
