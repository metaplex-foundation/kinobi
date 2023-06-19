/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Context } from '@metaplex-foundation/umi';
import { Serializer, struct, u64 } from '@metaplex-foundation/umi/serializers';

export type SetCollectionSizeArgs = { size: bigint };

export type SetCollectionSizeArgsArgs = { size: number | bigint };

export function getSetCollectionSizeArgsSerializer(
  _context: object = {}
): Serializer<SetCollectionSizeArgsArgs, SetCollectionSizeArgs> {
  return struct<SetCollectionSizeArgs>([['size', u64()]], {
    description: 'SetCollectionSizeArgs',
  }) as Serializer<SetCollectionSizeArgsArgs, SetCollectionSizeArgs>;
}
