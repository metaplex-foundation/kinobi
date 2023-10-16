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
  getU64Decoder,
  getU64Encoder,
  getU8Decoder,
  getU8Encoder,
} from '@solana/codecs-numbers';
import {
  AccountRole,
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
export type BurnTokenInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string = string,
  TAccountMint extends string = string,
  TAccountAuthority extends string = string
> = IInstruction<TProgram> &
  IInstructionWithData<BurnTokenInstructionData> &
  IInstructionWithAccounts<
    [
      WritableAccount<TAccountAccount>,
      WritableAccount<TAccountMint>,
      ReadonlySignerAccount<TAccountAuthority>
    ]
  >;

export type BurnTokenInstructionData = {
  discriminator: number;
  amount: bigint;
};

export type BurnTokenInstructionDataArgs = { amount: number | bigint };

export function getBurnTokenInstructionDataEncoder(): Encoder<BurnTokenInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<BurnTokenInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['amount', getU64Encoder()],
      ],
      { description: 'BurnTokenInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 8 } as BurnTokenInstructionData)
  ) as Encoder<BurnTokenInstructionDataArgs>;
}

export function getBurnTokenInstructionDataDecoder(): Decoder<BurnTokenInstructionData> {
  return getStructDecoder<BurnTokenInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['amount', getU64Decoder()],
    ],
    { description: 'BurnTokenInstructionData' }
  ) as Decoder<BurnTokenInstructionData>;
}

export function getBurnTokenInstructionDataCodec(): Codec<
  BurnTokenInstructionDataArgs,
  BurnTokenInstructionData
> {
  return combineCodec(
    getBurnTokenInstructionDataEncoder(),
    getBurnTokenInstructionDataDecoder()
  );
}

export function burnTokenInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string = string,
  TAccountMint extends string = string,
  TAccountAuthority extends string = string
>(
  accounts: {
    account: Base58EncodedAddress<TAccountAccount>;
    mint: Base58EncodedAddress<TAccountMint>;
    authority: Base58EncodedAddress<TAccountAuthority>;
  },
  args: BurnTokenInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<TProgram>
): BurnTokenInstruction<
  TProgram,
  TAccountAccount,
  TAccountMint,
  TAccountAuthority
> {
  return {
    accounts: [
      { address: accounts.account, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.mint, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.authority, role: AccountRole.WRITABLE_SIGNER },
    ],
    data: getBurnTokenInstructionDataEncoder().encode(args),
    programAddress,
  };
}
