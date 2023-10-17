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
  ReadonlySignerAccount,
  WritableAccount,
} from '@solana/instructions';
import { accountMetaWithDefault } from '../shared';

// Output.
export type RemoveCreatorVerificationInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountCreator extends string | IAccountMeta<string> = string
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountMetadata extends string
        ? WritableAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountCreator extends string
        ? ReadonlySignerAccount<TAccountCreator>
        : TAccountCreator
    ]
  >;

export type RemoveCreatorVerificationInstructionData = {
  discriminator: number;
};

export type RemoveCreatorVerificationInstructionDataArgs = {};

export function getRemoveCreatorVerificationInstructionDataEncoder(): Encoder<RemoveCreatorVerificationInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<RemoveCreatorVerificationInstructionData>(
      [['discriminator', getU8Encoder()]],
      { description: 'RemoveCreatorVerificationInstructionData' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: 28,
      } as RemoveCreatorVerificationInstructionData)
  ) as Encoder<RemoveCreatorVerificationInstructionDataArgs>;
}

export function getRemoveCreatorVerificationInstructionDataDecoder(): Decoder<RemoveCreatorVerificationInstructionData> {
  return getStructDecoder<RemoveCreatorVerificationInstructionData>(
    [['discriminator', getU8Decoder()]],
    { description: 'RemoveCreatorVerificationInstructionData' }
  ) as Decoder<RemoveCreatorVerificationInstructionData>;
}

export function getRemoveCreatorVerificationInstructionDataCodec(): Codec<
  RemoveCreatorVerificationInstructionDataArgs,
  RemoveCreatorVerificationInstructionData
> {
  return combineCodec(
    getRemoveCreatorVerificationInstructionDataEncoder(),
    getRemoveCreatorVerificationInstructionDataDecoder()
  );
}

export function removeCreatorVerificationInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountCreator extends string | IAccountMeta<string> = string
>(
  accounts: {
    metadata: TAccountMetadata extends string
      ? Base58EncodedAddress<TAccountMetadata>
      : TAccountMetadata;
    creator: TAccountCreator extends string
      ? Base58EncodedAddress<TAccountCreator>
      : TAccountCreator;
  },
  programAddress: Base58EncodedAddress<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.metadata, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.creator, AccountRole.READONLY_SIGNER),
    ],
    data: getRemoveCreatorVerificationInstructionDataEncoder().encode({}),
    programAddress,
  } as RemoveCreatorVerificationInstruction<
    TProgram,
    TAccountMetadata,
    TAccountCreator
  >;
}
