import { Nullable, Option, PublicKey } from '@metaplex-foundation/umi';
import {
  array,
  mapSerializer,
  option,
  publicKey,
  Serializer,
  struct,
  u64,
} from '@metaplex-foundation/umi/serializers';
import {
  getReservationV1Serializer,
  getTmKeySerializer,
  ReservationV1,
  ReservationV1Args,
  TmKey,
} from '../generated';

export type ReservationListV1AccountData = {
  key: TmKey;
  masterEdition: PublicKey;
  supplySnapshot: Option<bigint>;
  reservations: Array<ReservationV1>;
};

export type ReservationListV1AccountDataArgs = {
  masterEdition: PublicKey;
  supplySnapshot: Option<number | bigint> | Nullable<number | bigint>;
  reservations: Array<ReservationV1Args>;
};

export function getReservationListV1AccountDataSerializer(): Serializer<
  ReservationListV1AccountDataArgs,
  ReservationListV1AccountData
> {
  return mapSerializer<
    ReservationListV1AccountDataArgs,
    ReservationListV1AccountData,
    ReservationListV1AccountData
  >(
    struct<ReservationListV1AccountData>(
      [
        ['key', getTmKeySerializer()],
        ['masterEdition', publicKey()],
        ['supplySnapshot', option(u64())],
        ['reservations', array(getReservationV1Serializer())],
      ],
      { description: 'ReservationListV1' }
    ),
    (value) =>
      ({
        ...value,
        key: TmKey.ReservationListV1,
      } as ReservationListV1AccountData)
  ) as Serializer<
    ReservationListV1AccountDataArgs,
    ReservationListV1AccountData
  >;
}
