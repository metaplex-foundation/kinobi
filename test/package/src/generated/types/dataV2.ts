/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Context, Option, Serializer } from '@metaplex-foundation/umi-core';
import {
  Collection,
  CollectionArgs,
  Creator,
  CreatorArgs,
  Uses,
  UsesArgs,
  getCollectionSerializer,
  getCreatorSerializer,
  getUsesSerializer,
} from '.';

export type DataV2 = {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Option<Array<Creator>>;
  collection: Option<Collection>;
  uses: Option<Uses>;
};

export type DataV2Args = {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Option<Array<CreatorArgs>>;
  collection: Option<CollectionArgs>;
  uses: Option<UsesArgs>;
};

export function getDataV2Serializer(
  context: Pick<Context, 'serializer'>
): Serializer<DataV2Args, DataV2> {
  const s = context.serializer;
  return s.struct<DataV2>(
    [
      ['name', s.string()],
      ['symbol', s.string()],
      ['uri', s.string()],
      ['sellerFeeBasisPoints', s.u16],
      ['creators', s.option(s.vec(getCreatorSerializer(context)))],
      ['collection', s.option(getCollectionSerializer(context))],
      ['uses', s.option(getUsesSerializer(context))],
    ],
    'DataV2'
  ) as Serializer<DataV2Args, DataV2>;
}
