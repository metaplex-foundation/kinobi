/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Codec,
  Decoder,
  Encoder,
  combineCodec,
  getScalarEnumDecoder,
  getScalarEnumEncoder,
} from '@solana/codecs';

export enum PayloadKey {
  Target,
  Holder,
  Authority,
  Amount,
}

export type PayloadKeyArgs = PayloadKey;

export function getPayloadKeyEncoder(): Encoder<PayloadKeyArgs> {
  return getScalarEnumEncoder(PayloadKey);
}

export function getPayloadKeyDecoder(): Decoder<PayloadKey> {
  return getScalarEnumDecoder(PayloadKey);
}

export function getPayloadKeyCodec(): Codec<PayloadKeyArgs, PayloadKey> {
  return combineCodec(getPayloadKeyEncoder(), getPayloadKeyDecoder());
}
