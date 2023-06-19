/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { PublicKey } from '@metaplex-foundation/umi';
import {
  Serializer,
  publicKey as publicKeySerializer,
  struct,
} from '@metaplex-foundation/umi/serializers';

export type ProgrammableConfig = { ruleSet: PublicKey };

export type ProgrammableConfigArgs = ProgrammableConfig;

export function getProgrammableConfigSerializer(
  _context: object = {}
): Serializer<ProgrammableConfigArgs, ProgrammableConfig> {
  return struct<ProgrammableConfig>([['ruleSet', publicKeySerializer()]], {
    description: 'ProgrammableConfig',
  }) as Serializer<ProgrammableConfigArgs, ProgrammableConfig>;
}
