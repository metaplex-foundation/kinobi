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
  IAccountMeta,
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  ReadonlyAccount,
  WritableAccount,
  WritableSignerAccount,
} from '@solana/instructions';
import { accountMetaWithDefault } from '../shared';

// Output.
export type ThawDelegatedAccountInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountDelegate extends string | IAccountMeta<string> = string,
  TAccountTokenAccount extends string | IAccountMeta<string> = string,
  TAccountEdition extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountTokenProgram extends
    | string
    | IAccountMeta<string> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountDelegate extends string
        ? WritableSignerAccount<TAccountDelegate>
        : TAccountDelegate,
      TAccountTokenAccount extends string
        ? WritableAccount<TAccountTokenAccount>
        : TAccountTokenAccount,
      TAccountEdition extends string
        ? ReadonlyAccount<TAccountEdition>
        : TAccountEdition,
      TAccountMint extends string
        ? ReadonlyAccount<TAccountMint>
        : TAccountMint,
      TAccountTokenProgram extends string
        ? ReadonlyAccount<TAccountTokenProgram>
        : TAccountTokenProgram
    ]
  >;

export type ThawDelegatedAccountInstructionData = { discriminator: number };

export type ThawDelegatedAccountInstructionDataArgs = {};

export function getThawDelegatedAccountInstructionDataEncoder(): Encoder<ThawDelegatedAccountInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<ThawDelegatedAccountInstructionData>(
      [['discriminator', getU8Encoder()]],
      { description: 'ThawDelegatedAccountInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 27 } as ThawDelegatedAccountInstructionData)
  ) as Encoder<ThawDelegatedAccountInstructionDataArgs>;
}

export function getThawDelegatedAccountInstructionDataDecoder(): Decoder<ThawDelegatedAccountInstructionData> {
  return getStructDecoder<ThawDelegatedAccountInstructionData>(
    [['discriminator', getU8Decoder()]],
    { description: 'ThawDelegatedAccountInstructionData' }
  ) as Decoder<ThawDelegatedAccountInstructionData>;
}

export function getThawDelegatedAccountInstructionDataCodec(): Codec<
  ThawDelegatedAccountInstructionDataArgs,
  ThawDelegatedAccountInstructionData
> {
  return combineCodec(
    getThawDelegatedAccountInstructionDataEncoder(),
    getThawDelegatedAccountInstructionDataDecoder()
  );
}

export function thawDelegatedAccountInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountDelegate extends string | IAccountMeta<string> = string,
  TAccountTokenAccount extends string | IAccountMeta<string> = string,
  TAccountEdition extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountTokenProgram extends
    | string
    | IAccountMeta<string> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  accounts: {
    delegate: TAccountDelegate extends string
      ? Base58EncodedAddress<TAccountDelegate>
      : TAccountDelegate;
    tokenAccount: TAccountTokenAccount extends string
      ? Base58EncodedAddress<TAccountTokenAccount>
      : TAccountTokenAccount;
    edition: TAccountEdition extends string
      ? Base58EncodedAddress<TAccountEdition>
      : TAccountEdition;
    mint: TAccountMint extends string
      ? Base58EncodedAddress<TAccountMint>
      : TAccountMint;
    tokenProgram?: TAccountTokenProgram extends string
      ? Base58EncodedAddress<TAccountTokenProgram>
      : TAccountTokenProgram;
  },
  programAddress: Base58EncodedAddress<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.delegate, AccountRole.WRITABLE_SIGNER),
      accountMetaWithDefault(accounts.tokenAccount, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.edition, AccountRole.READONLY),
      accountMetaWithDefault(accounts.mint, AccountRole.READONLY),
      accountMetaWithDefault(
        accounts.tokenProgram ?? {
          address:
            'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
    ],
    data: getThawDelegatedAccountInstructionDataEncoder().encode({}),
    programAddress,
  } as ThawDelegatedAccountInstruction<
    TProgram,
    TAccountDelegate,
    TAccountTokenAccount,
    TAccountEdition,
    TAccountMint,
    TAccountTokenProgram
  >;
}
