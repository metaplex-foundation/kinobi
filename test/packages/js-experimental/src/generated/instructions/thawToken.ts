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
  ReadonlySignerAccount,
  WritableAccount,
} from '@solana/instructions';
import { accountMetaWithDefault } from '../shared';

// Output.
export type ThawTokenInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountOwner extends string | IAccountMeta<string> = string
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountAccount extends string
        ? WritableAccount<TAccountAccount>
        : TAccountAccount,
      TAccountMint extends string
        ? ReadonlyAccount<TAccountMint>
        : TAccountMint,
      TAccountOwner extends string
        ? ReadonlySignerAccount<TAccountOwner>
        : TAccountOwner
    ]
  >;

export type ThawTokenInstructionData = { discriminator: number };

export type ThawTokenInstructionDataArgs = {};

export function getThawTokenInstructionDataEncoder(): Encoder<ThawTokenInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<ThawTokenInstructionData>(
      [['discriminator', getU8Encoder()]],
      { description: 'ThawTokenInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 11 } as ThawTokenInstructionData)
  ) as Encoder<ThawTokenInstructionDataArgs>;
}

export function getThawTokenInstructionDataDecoder(): Decoder<ThawTokenInstructionData> {
  return getStructDecoder<ThawTokenInstructionData>(
    [['discriminator', getU8Decoder()]],
    { description: 'ThawTokenInstructionData' }
  ) as Decoder<ThawTokenInstructionData>;
}

export function getThawTokenInstructionDataCodec(): Codec<
  ThawTokenInstructionDataArgs,
  ThawTokenInstructionData
> {
  return combineCodec(
    getThawTokenInstructionDataEncoder(),
    getThawTokenInstructionDataDecoder()
  );
}

export function thawTokenInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountOwner extends string | IAccountMeta<string> = string
>(
  accounts: {
    account: TAccountAccount extends string
      ? Base58EncodedAddress<TAccountAccount>
      : TAccountAccount;
    mint: TAccountMint extends string
      ? Base58EncodedAddress<TAccountMint>
      : TAccountMint;
    owner: TAccountOwner extends string
      ? Base58EncodedAddress<TAccountOwner>
      : TAccountOwner;
  },
  programAddress: Base58EncodedAddress<TProgram> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.account, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.mint, AccountRole.READONLY),
      accountMetaWithDefault(accounts.owner, AccountRole.READONLY_SIGNER),
    ],
    data: getThawTokenInstructionDataEncoder().encode({}),
    programAddress,
  } as ThawTokenInstruction<
    TProgram,
    TAccountAccount,
    TAccountMint,
    TAccountOwner
  >;
}
