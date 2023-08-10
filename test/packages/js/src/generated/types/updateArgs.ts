/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Option,
  OptionOrNullable,
  PublicKey,
  some,
} from '@metaplex-foundation/umi';
import {
  GetDataEnumKind,
  GetDataEnumKindContent,
  Serializer,
  array,
  bool,
  dataEnum,
  mapSerializer,
  option,
  publicKey as publicKeySerializer,
  string,
  struct,
  u16,
} from '@metaplex-foundation/umi/serializers';
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
  getAuthorityTypeSerializer,
  getAuthorizationDataSerializer,
  getCollectionDetailsSerializer,
  getCollectionSerializer,
  getCreatorSerializer,
  getDelegateStateSerializer,
  getProgrammableConfigSerializer,
  getTokenStandardSerializer,
  getUsesSerializer,
} from '.';

export type UpdateArgs = {
  __kind: 'V1';
  authorizationData: Option<AuthorizationData>;
  newUpdateAuthority: Option<PublicKey>;
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
  newUpdateAuthority: OptionOrNullable<PublicKey>;
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

/** @deprecated Use `getUpdateArgsSerializer()` without any argument instead. */
export function getUpdateArgsSerializer(
  _context: object
): Serializer<UpdateArgsArgs, UpdateArgs>;
export function getUpdateArgsSerializer(): Serializer<
  UpdateArgsArgs,
  UpdateArgs
>;
export function getUpdateArgsSerializer(
  _context: object = {}
): Serializer<UpdateArgsArgs, UpdateArgs> {
  return dataEnum<UpdateArgs>(
    [
      [
        'V1',
        mapSerializer<
          GetDataEnumKindContent<UpdateArgsArgs, 'V1'>,
          any,
          GetDataEnumKindContent<UpdateArgs, 'V1'>
        >(
          struct<GetDataEnumKindContent<UpdateArgs, 'V1'>>([
            ['authorizationData', option(getAuthorizationDataSerializer())],
            ['newUpdateAuthority', option(publicKeySerializer())],
            [
              'data',
              option(
                struct<any>([
                  ['name', string()],
                  ['symbol', string()],
                  ['uri', string()],
                  ['sellerFeeBasisPoints', u16()],
                  ['creators', option(array(getCreatorSerializer()))],
                ])
              ),
            ],
            ['primarySaleHappened', option(bool())],
            ['isMutable', option(bool())],
            ['tokenStandard', option(getTokenStandardSerializer())],
            ['collection', option(getCollectionSerializer())],
            ['uses', option(getUsesSerializer())],
            ['collectionDetails', option(getCollectionDetailsSerializer())],
            ['programmableConfig', option(getProgrammableConfigSerializer())],
            ['delegateState', option(getDelegateStateSerializer())],
            ['authorityType', getAuthorityTypeSerializer()],
          ]),
          (value) => ({
            ...value,
            tokenStandard:
              value.tokenStandard ?? some(TokenStandard.NonFungible),
          })
        ),
      ],
    ],
    { description: 'UpdateArgs' }
  ) as Serializer<UpdateArgsArgs, UpdateArgs>;
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