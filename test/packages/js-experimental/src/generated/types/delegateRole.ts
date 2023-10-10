/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Codec, Decoder, Encoder, combineCodec } from '@solana/codecs-core';
import {
  getScalarEnumDecoder,
  getScalarEnumEncoder,
} from '@solana/codecs-data-structures';

export enum DelegateRole {
  Authority,
  Collection,
  Transfer,
  Use,
  Utility,
  Sale,
  Update,
}

export type DelegateRoleArgs = DelegateRole;

export function getDelegateRoleEncoder(): Encoder<DelegateRoleArgs> {
  return getScalarEnumEncoder<DelegateRole>(DelegateRole, {
    description: 'DelegateRole',
  }) as Encoder<DelegateRoleArgs>;
}

export function getDelegateRoleDecoder(): Decoder<DelegateRole> {
  return getScalarEnumDecoder<DelegateRole>(DelegateRole, {
    description: 'DelegateRole',
  }) as Decoder<DelegateRole>;
}

export function getDelegateRoleCodec(): Codec<DelegateRoleArgs, DelegateRole> {
  return combineCodec(getDelegateRoleEncoder(), getDelegateRoleDecoder());
}
