/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Option, OptionOrNullable, PublicKey } from '@metaplex-foundation/umi';
import {
  Serializer,
  array,
  bool,
  option,
  publicKey as publicKeySerializer,
  string,
  struct,
  u16,
  u8,
} from '@metaplex-foundation/umi/serializers';
import {
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
  getCollectionDetailsSerializer,
  getCollectionSerializer,
  getCreatorSerializer,
  getDelegateStateSerializer,
  getProgrammableConfigSerializer,
  getTokenStandardSerializer,
  getUsesSerializer,
} from '.';

export type AssetData = {
  updateAuthority: PublicKey;
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Option<Array<Creator>>;
  primarySaleHappened: boolean;
  isMutable: boolean;
  editionNonce: Option<number>;
  tokenStandard: TokenStandard;
  collection: Option<Collection>;
  uses: Option<Uses>;
  collectionDetails: Option<CollectionDetails>;
  programmableConfig: Option<ProgrammableConfig>;
  delegateState: Option<DelegateState>;
};

export type AssetDataArgs = {
  updateAuthority: PublicKey;
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: OptionOrNullable<Array<CreatorArgs>>;
  primarySaleHappened: boolean;
  isMutable: boolean;
  editionNonce: OptionOrNullable<number>;
  tokenStandard: TokenStandardArgs;
  collection: OptionOrNullable<CollectionArgs>;
  uses: OptionOrNullable<UsesArgs>;
  collectionDetails: OptionOrNullable<CollectionDetailsArgs>;
  programmableConfig: OptionOrNullable<ProgrammableConfigArgs>;
  delegateState: OptionOrNullable<DelegateStateArgs>;
};

export function getAssetDataSerializer(
  _context: object = {}
): Serializer<AssetDataArgs, AssetData> {
  return struct<AssetData>(
    [
      ['updateAuthority', publicKeySerializer()],
      ['name', string()],
      ['symbol', string()],
      ['uri', string()],
      ['sellerFeeBasisPoints', u16()],
      ['creators', option(array(getCreatorSerializer()))],
      ['primarySaleHappened', bool()],
      ['isMutable', bool()],
      ['editionNonce', option(u8())],
      ['tokenStandard', getTokenStandardSerializer()],
      ['collection', option(getCollectionSerializer())],
      ['uses', option(getUsesSerializer())],
      ['collectionDetails', option(getCollectionDetailsSerializer())],
      ['programmableConfig', option(getProgrammableConfigSerializer())],
      ['delegateState', option(getDelegateStateSerializer())],
    ],
    { description: 'AssetData' }
  ) as Serializer<AssetDataArgs, AssetData>;
}
