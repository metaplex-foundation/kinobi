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
import { getU8Decoder, getU8Encoder } from '@solana/codecs-numbers';
import {
  AccountRole,
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
export type FreezeDelegatedAccountInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountDelegate extends string = string,
  TAccountTokenAccount extends string = string,
  TAccountEdition extends string = string,
  TAccountMint extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
> = IInstruction<TProgram> &
  IInstructionWithData<FreezeDelegatedAccountInstructionData> &
  IInstructionWithAccounts<
    [
      WritableSignerAccount<TAccountDelegate>,
      WritableAccount<TAccountTokenAccount>,
      ReadonlyAccount<TAccountEdition>,
      ReadonlyAccount<TAccountMint>,
      ReadonlyAccount<TAccountTokenProgram>
    ]
  >;

export type FreezeDelegatedAccountInstructionData = { discriminator: number };

export type FreezeDelegatedAccountInstructionDataArgs = {};

export function getFreezeDelegatedAccountInstructionDataEncoder(): Encoder<FreezeDelegatedAccountInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<FreezeDelegatedAccountInstructionData>(
      [['discriminator', getU8Encoder()]],
      { description: 'FreezeDelegatedAccountInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 26 } as FreezeDelegatedAccountInstructionData)
  ) as Encoder<FreezeDelegatedAccountInstructionDataArgs>;
}

export function getFreezeDelegatedAccountInstructionDataDecoder(): Decoder<FreezeDelegatedAccountInstructionData> {
  return getStructDecoder<FreezeDelegatedAccountInstructionData>(
    [['discriminator', getU8Decoder()]],
    { description: 'FreezeDelegatedAccountInstructionData' }
  ) as Decoder<FreezeDelegatedAccountInstructionData>;
}

export function getFreezeDelegatedAccountInstructionDataCodec(): Codec<
  FreezeDelegatedAccountInstructionDataArgs,
  FreezeDelegatedAccountInstructionData
> {
  return combineCodec(
    getFreezeDelegatedAccountInstructionDataEncoder(),
    getFreezeDelegatedAccountInstructionDataDecoder()
  );
}

export function freezeDelegatedAccountInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountDelegate extends string = string,
  TAccountTokenAccount extends string = string,
  TAccountEdition extends string = string,
  TAccountMint extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  accounts: {
    delegate: Base58EncodedAddress<TAccountDelegate>;
    tokenAccount: Base58EncodedAddress<TAccountTokenAccount>;
    edition: Base58EncodedAddress<TAccountEdition>;
    mint: Base58EncodedAddress<TAccountMint>;
    tokenProgram: Base58EncodedAddress<TAccountTokenProgram>;
  },
  programAddress: Base58EncodedAddress<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<TProgram>
): FreezeDelegatedAccountInstruction<
  TProgram,
  TAccountDelegate,
  TAccountTokenAccount,
  TAccountEdition,
  TAccountMint,
  TAccountTokenProgram
> {
  return {
    accounts: [
      { address: accounts.delegate, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.tokenAccount, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.edition, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.mint, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.tokenProgram, role: AccountRole.WRITABLE_SIGNER },
    ],
    data: getFreezeDelegatedAccountInstructionDataEncoder().encode({}),
    programAddress,
  };
}