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

export enum UseMethod {
  Burn,
  Multiple,
  Single,
}

export type UseMethodArgs = UseMethod;

export function getUseMethodEncoder(): Encoder<UseMethodArgs> {
  return getScalarEnumEncoder(UseMethod);
}

export function getUseMethodDecoder(): Decoder<UseMethod> {
  return getScalarEnumDecoder(UseMethod);
}

export function getUseMethodCodec(): Codec<UseMethodArgs, UseMethod> {
  return combineCodec(getUseMethodEncoder(), getUseMethodDecoder());
}
