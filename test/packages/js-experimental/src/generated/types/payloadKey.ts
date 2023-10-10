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

export enum PayloadKey {
  Target,
  Holder,
  Authority,
  Amount,
}

export type PayloadKeyArgs = PayloadKey;

export function getPayloadKeyEncoder(): Encoder<PayloadKeyArgs> {
  return getScalarEnumEncoder<PayloadKey>(PayloadKey, {
    description: 'PayloadKey',
  }) as Encoder<PayloadKeyArgs>;
}

export function getPayloadKeyDecoder(): Decoder<PayloadKey> {
  return getScalarEnumDecoder<PayloadKey>(PayloadKey, {
    description: 'PayloadKey',
  }) as Decoder<PayloadKey>;
}

export function getPayloadKeyCodec(): Codec<PayloadKeyArgs, PayloadKey> {
  return combineCodec(getPayloadKeyEncoder(), getPayloadKeyDecoder());
}
