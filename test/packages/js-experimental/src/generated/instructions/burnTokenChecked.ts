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
export type BurnTokenCheckedInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string = string,
  TAccountMint extends string = string,
  TAccountAuthority extends string = string
> = IInstruction<TProgram> &
  IInstructionWithData<BurnTokenCheckedInstructionData> &
  IInstructionWithAccounts<
    [
      WritableAccount<TAccountAccount>,
      WritableAccount<TAccountMint>,
      ReadonlySignerAccount<TAccountAuthority>
    ]
  >;

export type BurnTokenCheckedInstructionData = {
  discriminator: number;
  amount: bigint;
  decimals: number;
};

export type BurnTokenCheckedInstructionDataArgs = {
  amount: number | bigint;
  decimals: number;
};

export function getBurnTokenCheckedInstructionDataEncoder(): Encoder<BurnTokenCheckedInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<BurnTokenCheckedInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['amount', getU64Encoder()],
        ['decimals', getU8Encoder()],
      ],
      { description: 'BurnTokenCheckedInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 15 } as BurnTokenCheckedInstructionData)
  ) as Encoder<BurnTokenCheckedInstructionDataArgs>;
}

export function getBurnTokenCheckedInstructionDataDecoder(): Decoder<BurnTokenCheckedInstructionData> {
  return getStructDecoder<BurnTokenCheckedInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['amount', getU64Decoder()],
      ['decimals', getU8Decoder()],
    ],
    { description: 'BurnTokenCheckedInstructionData' }
  ) as Decoder<BurnTokenCheckedInstructionData>;
}

export function getBurnTokenCheckedInstructionDataCodec(): Codec<
  BurnTokenCheckedInstructionDataArgs,
  BurnTokenCheckedInstructionData
> {
  return combineCodec(
    getBurnTokenCheckedInstructionDataEncoder(),
    getBurnTokenCheckedInstructionDataDecoder()
  );
}

export function burnTokenCheckedInstruction<
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
  args: BurnTokenCheckedInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<TProgram>
): BurnTokenCheckedInstruction<
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
    data: getBurnTokenCheckedInstructionDataEncoder().encode(args),
    programAddress,
  };
}
