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
  GetDataEnumKind,
  GetDataEnumKindContent,
  getArrayDecoder,
  getArrayEncoder,
  getBooleanDecoder,
  getBooleanEncoder,
  getDataEnumDecoder,
  getDataEnumEncoder,
  getStructDecoder,
  getStructEncoder,
} from '@solana/codecs-data-structures';
import { getU16Decoder, getU16Encoder } from '@solana/codecs-numbers';
import { getStringDecoder, getStringEncoder } from '@solana/codecs-strings';
import {
  Option,
  OptionOrNullable,
  getOptionDecoder,
  getOptionEncoder,
  some,
} from '@solana/options';
import {
  AuthorityType,
  AuthorityTypeArgs,
  AuthorizationData,
  AuthorizationDataArgs,
  Collection,
  CollectionArgs,
  CollectionDetails,
  CollectionDetailsArgs,
  Creator,
  CreatorArgs,
  DelegateState,
  DelegateStateArgs,
  ProgrammableConfig,
  ProgrammableConfigArgs,
  TokenStandard,
  TokenStandardArgs,
  Uses,
  UsesArgs,
  getAuthorityTypeDecoder,
  getAuthorityTypeEncoder,
  getAuthorizationDataDecoder,
  getAuthorizationDataEncoder,
  getCollectionDecoder,
  getCollectionDetailsDecoder,
  getCollectionDetailsEncoder,
  getCollectionEncoder,
  getCreatorDecoder,
  getCreatorEncoder,
  getDelegateStateDecoder,
  getDelegateStateEncoder,
  getProgrammableConfigDecoder,
  getProgrammableConfigEncoder,
  getTokenStandardDecoder,
  getTokenStandardEncoder,
  getUsesDecoder,
  getUsesEncoder,
} from '.';

export type UpdateArgs = {
  __kind: 'V1';
  authorizationData: Option<AuthorizationData>;
  newUpdateAuthority: Option<Base58EncodedAddress>;
  data: Option<{
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: Option<Array<Creator>>;
  }>;
  primarySaleHappened: Option<boolean>;
  isMutable: Option<boolean>;
  tokenStandard: Option<TokenStandard>;
  collection: Option<Collection>;
  uses: Option<Uses>;
  collectionDetails: Option<CollectionDetails>;
  programmableConfig: Option<ProgrammableConfig>;
  delegateState: Option<DelegateState>;
  authorityType: AuthorityType;
};

export type UpdateArgsArgs = {
  __kind: 'V1';
  authorizationData: OptionOrNullable<AuthorizationDataArgs>;
  newUpdateAuthority: OptionOrNullable<Base58EncodedAddress>;
  data: OptionOrNullable<{
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: OptionOrNullable<Array<CreatorArgs>>;
  }>;
  primarySaleHappened: OptionOrNullable<boolean>;
  isMutable: OptionOrNullable<boolean>;
  tokenStandard?: OptionOrNullable<TokenStandardArgs>;
  collection: OptionOrNullable<CollectionArgs>;
  uses: OptionOrNullable<UsesArgs>;
  collectionDetails: OptionOrNullable<CollectionDetailsArgs>;
  programmableConfig: OptionOrNullable<ProgrammableConfigArgs>;
  delegateState: OptionOrNullable<DelegateStateArgs>;
  authorityType: AuthorityTypeArgs;
};

export function getUpdateArgsEncoder(): Encoder<UpdateArgsArgs> {
  return getDataEnumEncoder<UpdateArgs>(
    [
      [
        'V1',
        mapEncoder(
          getStructEncoder<GetDataEnumKindContent<UpdateArgs, 'V1'>>([
            [
              'authorizationData',
              getOptionEncoder(getAuthorizationDataEncoder()),
            ],
            ['newUpdateAuthority', getOptionEncoder(getAddressEncoder())],
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
            ['primarySaleHappened', getOptionEncoder(getBooleanEncoder())],
            ['isMutable', getOptionEncoder(getBooleanEncoder())],
            ['tokenStandard', getOptionEncoder(getTokenStandardEncoder())],
            ['collection', getOptionEncoder(getCollectionEncoder())],
            ['uses', getOptionEncoder(getUsesEncoder())],
            [
              'collectionDetails',
              getOptionEncoder(getCollectionDetailsEncoder()),
            ],
            [
              'programmableConfig',
              getOptionEncoder(getProgrammableConfigEncoder()),
            ],
            ['delegateState', getOptionEncoder(getDelegateStateEncoder())],
            ['authorityType', getAuthorityTypeEncoder()],
          ]),
          (value) =>
            ({
              ...value,
              tokenStandard:
                value.tokenStandard ?? some(TokenStandard.NonFungible),
            } as GetDataEnumKindContent<UpdateArgs, 'V1'>)
        ),
      ],
    ],
    { description: 'UpdateArgs' }
  ) as Encoder<UpdateArgsArgs>;
}

export function getUpdateArgsDecoder(): Decoder<UpdateArgs> {
  return getDataEnumDecoder<UpdateArgs>(
    [
      [
        'V1',
        getStructDecoder<GetDataEnumKindContent<UpdateArgs, 'V1'>>([
          [
            'authorizationData',
            getOptionDecoder(getAuthorizationDataDecoder()),
          ],
          ['newUpdateAuthority', getOptionDecoder(getAddressDecoder())],
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
          ['primarySaleHappened', getOptionDecoder(getBooleanDecoder())],
          ['isMutable', getOptionDecoder(getBooleanDecoder())],
          ['tokenStandard', getOptionDecoder(getTokenStandardDecoder())],
          ['collection', getOptionDecoder(getCollectionDecoder())],
          ['uses', getOptionDecoder(getUsesDecoder())],
          [
            'collectionDetails',
            getOptionDecoder(getCollectionDetailsDecoder()),
          ],
          [
            'programmableConfig',
            getOptionDecoder(getProgrammableConfigDecoder()),
          ],
          ['delegateState', getOptionDecoder(getDelegateStateDecoder())],
          ['authorityType', getAuthorityTypeDecoder()],
        ]),
      ],
    ],
    { description: 'UpdateArgs' }
  ) as Decoder<UpdateArgs>;
}

export function getUpdateArgsCodec(): Codec<UpdateArgsArgs, UpdateArgs> {
  return combineCodec(getUpdateArgsEncoder(), getUpdateArgsDecoder());
}

// Data Enum Helpers.
export function updateArgs(
  kind: 'V1',
  data: GetDataEnumKindContent<UpdateArgsArgs, 'V1'>
): GetDataEnumKind<UpdateArgsArgs, 'V1'>;
export function updateArgs<K extends UpdateArgsArgs['__kind']>(
  kind: K,
  data?: any
): Extract<UpdateArgsArgs, { __kind: K }> {
  return Array.isArray(data)
    ? { __kind: kind, fields: data }
    : { __kind: kind, ...(data ?? {}) };
}
export function isUpdateArgs<K extends UpdateArgs['__kind']>(
  kind: K,
  value: UpdateArgs
): value is UpdateArgs & { __kind: K } {
  return value.__kind === kind;
}
