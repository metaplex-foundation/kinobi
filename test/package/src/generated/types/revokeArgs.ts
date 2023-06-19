/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Context } from '@metaplex-foundation/umi';
import { Serializer } from '@metaplex-foundation/umi/serializers';

export enum RevokeArgs {
  CollectionV1,
  TransferV1,
  SaleV1,
}

export type RevokeArgsArgs = RevokeArgs;

export function getRevokeArgsSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<RevokeArgsArgs, RevokeArgs> {
  const s = context.serializer;
  return s.enum<RevokeArgs>(RevokeArgs, {
    description: 'RevokeArgs',
  }) as Serializer<RevokeArgsArgs, RevokeArgs>;
}
