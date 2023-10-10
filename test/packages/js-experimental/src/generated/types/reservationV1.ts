/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Base58EncodedAddress,
  getAddressDecoder,
  getAddressEncoder,
} from '@solana/addresses';
import { Codec, Decoder, Encoder, combineCodec } from '@solana/codecs-core';
import {
  getStructDecoder,
  getStructEncoder,
} from '@solana/codecs-data-structures';
import { getU8Decoder, getU8Encoder } from '@solana/codecs-numbers';

export type ReservationV1 = {
  address: Base58EncodedAddress;
  spotsRemaining: number;
  totalSpots: number;
};

export type ReservationV1Args = ReservationV1;

export function getReservationV1Encoder(): Encoder<ReservationV1Args> {
  return getStructEncoder<ReservationV1>(
    [
      ['address', getAddressEncoder()],
      ['spotsRemaining', getU8Encoder()],
      ['totalSpots', getU8Encoder()],
    ],
    { description: 'ReservationV1' }
  ) as Encoder<ReservationV1Args>;
}

export function getReservationV1Decoder(): Decoder<ReservationV1> {
  return getStructDecoder<ReservationV1>(
    [
      ['address', getAddressDecoder()],
      ['spotsRemaining', getU8Decoder()],
      ['totalSpots', getU8Decoder()],
    ],
    { description: 'ReservationV1' }
  ) as Decoder<ReservationV1>;
}

export function getReservationV1Codec(): Codec<
  ReservationV1Args,
  ReservationV1
> {
  return combineCodec(getReservationV1Encoder(), getReservationV1Decoder());
}
