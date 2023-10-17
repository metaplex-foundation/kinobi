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
  getArrayDecoder,
  getArrayEncoder,
  getBooleanDecoder,
  getBooleanEncoder,
  getStructDecoder,
  getStructEncoder,
} from '@solana/codecs-data-structures';
import {
  getU16Decoder,
  getU16Encoder,
  getU8Decoder,
  getU8Encoder,
} from '@solana/codecs-numbers';
import { getStringDecoder, getStringEncoder } from '@solana/codecs-strings';
import {
  AccountRole,
  IAccountMeta,
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  ReadonlySignerAccount,
  WritableAccount,
} from '@solana/instructions';
import {
  Option,
  OptionOrNullable,
  getOptionDecoder,
  getOptionEncoder,
} from '@solana/options';
import { Signer, accountMetaWithDefault } from '../shared';
import {
  Creator,
  CreatorArgs,
  getCreatorDecoder,
  getCreatorEncoder,
} from '../types';

// Output.
export type UpdateMetadataAccountInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountMetadata extends string
        ? WritableAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountUpdateAuthority extends string
        ? ReadonlySignerAccount<TAccountUpdateAuthority>
        : TAccountUpdateAuthority
    ]
  >;

export type UpdateMetadataAccountInstructionData = {
  discriminator: number;
  data: Option<{
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: Option<Array<Creator>>;
  }>;
  updateAuthority: Option<Base58EncodedAddress>;
  primarySaleHappened: Option<boolean>;
};

export type UpdateMetadataAccountInstructionDataArgs = {
  data: OptionOrNullable<{
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: OptionOrNullable<Array<CreatorArgs>>;
  }>;
  updateAuthority: OptionOrNullable<Base58EncodedAddress>;
  primarySaleHappened: OptionOrNullable<boolean>;
};

export function getUpdateMetadataAccountInstructionDataEncoder(): Encoder<UpdateMetadataAccountInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<UpdateMetadataAccountInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        [
          'data',
          getOptionEncoder(
            getStructEncoder<any>([
              ['name', getStringEncoder()],
              ['symbol', getStringEncoder()],
              ['uri', getStringEncoder()],
              ['sellerFeeBasisPoints', getU16Encoder()],
              [
                'creators',
                getOptionEncoder(getArrayEncoder(getCreatorEncoder())),
              ],
            ])
          ),
        ],
        ['updateAuthority', getOptionEncoder(getAddressEncoder())],
        ['primarySaleHappened', getOptionEncoder(getBooleanEncoder())],
      ],
      { description: 'UpdateMetadataAccountInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 1 } as UpdateMetadataAccountInstructionData)
  ) as Encoder<UpdateMetadataAccountInstructionDataArgs>;
}

export function getUpdateMetadataAccountInstructionDataDecoder(): Decoder<UpdateMetadataAccountInstructionData> {
  return getStructDecoder<UpdateMetadataAccountInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      [
        'data',
        getOptionDecoder(
          getStructDecoder<any>([
            ['name', getStringDecoder()],
            ['symbol', getStringDecoder()],
            ['uri', getStringDecoder()],
            ['sellerFeeBasisPoints', getU16Decoder()],
            [
              'creators',
              getOptionDecoder(getArrayDecoder(getCreatorDecoder())),
            ],
          ])
        ),
      ],
      ['updateAuthority', getOptionDecoder(getAddressDecoder())],
      ['primarySaleHappened', getOptionDecoder(getBooleanDecoder())],
    ],
    { description: 'UpdateMetadataAccountInstructionData' }
  ) as Decoder<UpdateMetadataAccountInstructionData>;
}

export function getUpdateMetadataAccountInstructionDataCodec(): Codec<
  UpdateMetadataAccountInstructionDataArgs,
  UpdateMetadataAccountInstructionData
> {
  return combineCodec(
    getUpdateMetadataAccountInstructionDataEncoder(),
    getUpdateMetadataAccountInstructionDataDecoder()
  );
}

export function updateMetadataAccountInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string
>(
  accounts: {
    metadata: TAccountMetadata extends string
      ? Base58EncodedAddress<TAccountMetadata>
      : TAccountMetadata;
    updateAuthority: TAccountUpdateAuthority extends string
      ? Base58EncodedAddress<TAccountUpdateAuthority>
      : TAccountUpdateAuthority;
  },
  args: UpdateMetadataAccountInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.metadata, AccountRole.WRITABLE),
      accountMetaWithDefault(
        accounts.updateAuthority,
        AccountRole.READONLY_SIGNER
      ),
    ],
    data: getUpdateMetadataAccountInstructionDataEncoder().encode(args),
    programAddress,
  } as UpdateMetadataAccountInstruction<
    TProgram,
    TAccountMetadata,
    TAccountUpdateAuthority
  >;
}

// Input.
export type UpdateMetadataAccountInput<
  TAccountMetadata extends string,
  TAccountUpdateAuthority extends string
> = {
  /** Metadata account */
  metadata: Base58EncodedAddress<TAccountMetadata>;
  /** Update authority key */
  updateAuthority: Signer<TAccountUpdateAuthority>;
  data: UpdateMetadataAccountInstructionDataArgs['data'];
  updateAuthorityArg: UpdateMetadataAccountInstructionDataArgs['updateAuthority'];
  primarySaleHappened: UpdateMetadataAccountInstructionDataArgs['primarySaleHappened'];
};
