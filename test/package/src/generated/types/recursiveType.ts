/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Context } from '@metaplex-foundation/umi';
import { Serializer } from '@metaplex-foundation/umi/serializers';

export type RecursiveType = { name: string; children: Array<RecursiveType> };

export type RecursiveTypeArgs = {
  name: string;
  children: Array<RecursiveTypeArgs>;
};

export function getRecursiveTypeSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<RecursiveTypeArgs, RecursiveType> {
  const s = context.serializer;
  return s.struct<RecursiveType>(
    [
      ['name', s.string()],
      ['children', s.array(getRecursiveTypeSerializer(context))],
    ],
    { description: 'RecursiveType' }
  ) as Serializer<RecursiveTypeArgs, RecursiveType>;
}
