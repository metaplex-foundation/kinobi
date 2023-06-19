/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Context, Option, PublicKey } from '@metaplex-foundation/umi';
import {
  Serializer,
  array,
  mapSerializer,
  option,
  publicKey as publicKeySerializer,
  struct,
  u64,
} from '@metaplex-foundation/umi/serializers';
import {
  ReservationV1,
  ReservationV1Args,
  TmKey,
  TmKeyArgs,
  getReservationV1Serializer,
  getTmKeySerializer,
} from '.';

export type ReservationListV1AccountData = {
  key: TmKey;
  masterEdition: PublicKey;
  supplySnapshot: Option<bigint>;
  reservations: Array<ReservationV1>;
};

export type ReservationListV1AccountDataArgs = {
  masterEdition: PublicKey;
  supplySnapshot: Option<number | bigint>;
  reservations: Array<ReservationV1Args>;
};

export function getReservationListV1AccountDataSerializer(
  _context: object = {}
): Serializer<ReservationListV1AccountDataArgs, ReservationListV1AccountData> {
  return mapSerializer<
    ReservationListV1AccountDataArgs,
    any,
    ReservationListV1AccountData
  >(
    struct<ReservationListV1AccountData>(
      [
        ['key', getTmKeySerializer()],
        ['masterEdition', publicKeySerializer()],
        ['supplySnapshot', option(u64())],
        ['reservations', array(getReservationV1Serializer())],
      ],
      { description: 'ReservationListV1AccountData' }
    ),
    (value) => ({ ...value, key: TmKey.ReservationListV1 })
  ) as Serializer<
    ReservationListV1AccountDataArgs,
    ReservationListV1AccountData
  >;
}
