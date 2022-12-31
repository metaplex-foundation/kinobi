/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Creator, CreatorArgs, getCreatorSerializer } from '.';
import { Context, Option, Serializer } from '@lorisleiva/js-core';

export type Data = {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Option<Array<Creator>>;
};
export type DataArgs = {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Option<Array<CreatorArgs>>;
};

export function getDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<DataArgs, Data> {
  const s = context.serializer;
  return s.struct<Data>(
    [
      ['name', s.string],
      ['symbol', s.string],
      ['uri', s.string],
      ['sellerFeeBasisPoints', s.u16],
      ['creators', s.option(s.vec(getCreatorSerializer(context)))],
    ],
    'Data'
  ) as Serializer<DataArgs, Data>;
}
