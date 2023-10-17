/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Base58EncodedAddress,
  getAddressDecoder,
  getAddressEncoder,
} from '@solana/addresses';
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
} from '@solana/instructions';
import {
  Option,
  OptionOrNullable,
  getOptionDecoder,
  getOptionEncoder,
} from '@solana/options';
import { accountMetaWithDefault } from '../shared';
import {
  TokenAuthorityType,
  TokenAuthorityTypeArgs,
  getTokenAuthorityTypeDecoder,
  getTokenAuthorityTypeEncoder,
} from '../types';

// Output.
export type SetTokenAuthorityInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountOwned extends string | IAccountMeta<string> = string,
  TAccountOwner extends string | IAccountMeta<string> = string
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountOwned extends string
        ? WritableAccount<TAccountOwned>
        : TAccountOwned,
      TAccountOwner extends string
        ? ReadonlyAccount<TAccountOwner>
        : TAccountOwner
    ]
  >;

export type SetTokenAuthorityInstructionData = {
  discriminator: number;
  authorityType: TokenAuthorityType;
  newAuthority: Option<Base58EncodedAddress>;
};

export type SetTokenAuthorityInstructionDataArgs = {
  authorityType: TokenAuthorityTypeArgs;
  newAuthority: OptionOrNullable<Base58EncodedAddress>;
};

export function getSetTokenAuthorityInstructionDataEncoder(): Encoder<SetTokenAuthorityInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<SetTokenAuthorityInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['authorityType', getTokenAuthorityTypeEncoder()],
        ['newAuthority', getOptionEncoder(getAddressEncoder())],
      ],
      { description: 'SetTokenAuthorityInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 6 } as SetTokenAuthorityInstructionData)
  ) as Encoder<SetTokenAuthorityInstructionDataArgs>;
}

export function getSetTokenAuthorityInstructionDataDecoder(): Decoder<SetTokenAuthorityInstructionData> {
  return getStructDecoder<SetTokenAuthorityInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['authorityType', getTokenAuthorityTypeDecoder()],
      ['newAuthority', getOptionDecoder(getAddressDecoder())],
    ],
    { description: 'SetTokenAuthorityInstructionData' }
  ) as Decoder<SetTokenAuthorityInstructionData>;
}

export function getSetTokenAuthorityInstructionDataCodec(): Codec<
  SetTokenAuthorityInstructionDataArgs,
  SetTokenAuthorityInstructionData
> {
  return combineCodec(
    getSetTokenAuthorityInstructionDataEncoder(),
    getSetTokenAuthorityInstructionDataDecoder()
  );
}

export function setTokenAuthorityInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountOwned extends string | IAccountMeta<string> = string,
  TAccountOwner extends string | IAccountMeta<string> = string
>(
  accounts: {
    owned: TAccountOwned extends string
      ? Base58EncodedAddress<TAccountOwned>
      : TAccountOwned;
    owner: TAccountOwner extends string
      ? Base58EncodedAddress<TAccountOwner>
      : TAccountOwner;
  },
  args: SetTokenAuthorityInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.owned, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.owner, AccountRole.READONLY),
    ],
    data: getSetTokenAuthorityInstructionDataEncoder().encode(args),
    programAddress,
  } as SetTokenAuthorityInstruction<TProgram, TAccountOwned, TAccountOwner>;
}
