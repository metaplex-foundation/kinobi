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
import {
  Codec,
  Decoder,
  Encoder,
  combineCodec,
  mapEncoder,
} from '@solana/codecs-core';
import {
  getArrayDecoder,
  getArrayEncoder,
  getStructDecoder,
  getStructEncoder,
} from '@solana/codecs-data-structures';
import { getU64Decoder, getU64Encoder } from '@solana/codecs-numbers';
import {
  Option,
  OptionOrNullable,
  getOptionDecoder,
  getOptionEncoder,
} from '@solana/options';
import {
  ReservationV1,
  ReservationV1Args,
  TmKey,
  getReservationV1Decoder,
  getReservationV1Encoder,
  getTmKeyDecoder,
  getTmKeyEncoder,
} from '.';

export type ReservationListV1AccountData = {
  key: TmKey;
  masterEdition: Base58EncodedAddress;
  supplySnapshot: Option<bigint>;
  reservations: Array<ReservationV1>;
};

export type ReservationListV1AccountDataArgs = {
  masterEdition: Base58EncodedAddress;
  supplySnapshot: OptionOrNullable<number | bigint>;
  reservations: Array<ReservationV1Args>;
};

export function getReservationListV1AccountDataEncoder(): Encoder<ReservationListV1AccountDataArgs> {
  return mapEncoder(
    getStructEncoder<ReservationListV1AccountData>(
      [
        ['key', getTmKeyEncoder()],
        ['masterEdition', getAddressEncoder()],
        ['supplySnapshot', getOptionEncoder(getU64Encoder())],
        ['reservations', getArrayEncoder(getReservationV1Encoder())],
      ],
      { description: 'ReservationListV1AccountData' }
    ),
    (value) =>
      ({
        ...value,
        key: TmKey.ReservationListV1,
      } as ReservationListV1AccountData)
  ) as Encoder<ReservationListV1AccountDataArgs>;
}

export function getReservationListV1AccountDataDecoder(): Decoder<ReservationListV1AccountData> {
  return getStructDecoder<ReservationListV1AccountData>(
    [
      ['key', getTmKeyDecoder()],
      ['masterEdition', getAddressDecoder()],
      ['supplySnapshot', getOptionDecoder(getU64Decoder())],
      ['reservations', getArrayDecoder(getReservationV1Decoder())],
    ],
    { description: 'ReservationListV1AccountData' }
  ) as Decoder<ReservationListV1AccountData>;
}

export function getReservationListV1AccountDataCodec(): Codec<
  ReservationListV1AccountDataArgs,
  ReservationListV1AccountData
> {
  return combineCodec(
    getReservationListV1AccountDataEncoder(),
    getReservationListV1AccountDataDecoder()
  );
}
