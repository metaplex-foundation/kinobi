/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Serializer, struct, u64 } from 'umiSerializers';

export type MintNewEditionFromMasterEditionViaTokenArgs = { edition: bigint };

export type MintNewEditionFromMasterEditionViaTokenArgsArgs = {
  edition: number | bigint;
};

export function getMintNewEditionFromMasterEditionViaTokenArgsSerializer(): Serializer<
  MintNewEditionFromMasterEditionViaTokenArgsArgs,
  MintNewEditionFromMasterEditionViaTokenArgs
> {
  return struct<MintNewEditionFromMasterEditionViaTokenArgs>(
    [['edition', u64()]],
    { description: 'MintNewEditionFromMasterEditionViaTokenArgs' }
  ) as Serializer<
    MintNewEditionFromMasterEditionViaTokenArgsArgs,
    MintNewEditionFromMasterEditionViaTokenArgs
  >;
}
