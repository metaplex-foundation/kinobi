import {
  type Address,
  type Codec,
  type Decoder,
  type Encoder,
  type Option,
  type OptionOrNullable,
  combineCodec,
  getAddressDecoder,
  getAddressEncoder,
  getArrayDecoder,
  getArrayEncoder,
  getOptionDecoder,
  getOptionEncoder,
  getStructDecoder,
  getStructEncoder,
  getU64Decoder,
  getU64Encoder,
  transformEncoder,
} from '@solana/web3.js';
import {
  type ReservationV1,
  type ReservationV1Args,
  TmKey,
  getReservationV1Decoder,
  getReservationV1Encoder,
  getTmKeyDecoder,
  getTmKeyEncoder,
} from '../generated';

export type ReservationListV1AccountData = {
  key: TmKey;
  masterEdition: Address;
  supplySnapshot: Option<bigint>;
  reservations: Array<ReservationV1>;
};

export type ReservationListV1AccountDataArgs = {
  masterEdition: Address;
  supplySnapshot: OptionOrNullable<number | bigint>;
  reservations: Array<ReservationV1Args>;
};

export function getReservationListV1AccountDataEncoder(): Encoder<ReservationListV1AccountDataArgs> {
  return transformEncoder(
    getStructEncoder([
      ['key', getTmKeyEncoder()],
      ['masterEdition', getAddressEncoder()],
      ['supplySnapshot', getOptionEncoder(getU64Encoder())],
      ['reservations', getArrayEncoder(getReservationV1Encoder())],
    ]),
    (value) => ({ ...value, key: TmKey.ReservationListV1 })
  );
}

export function getReservationListV1AccountDataDecoder(): Decoder<ReservationListV1AccountData> {
  return getStructDecoder([
    ['key', getTmKeyDecoder()],
    ['masterEdition', getAddressDecoder()],
    ['supplySnapshot', getOptionDecoder(getU64Decoder())],
    ['reservations', getArrayDecoder(getReservationV1Decoder())],
  ]);
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
