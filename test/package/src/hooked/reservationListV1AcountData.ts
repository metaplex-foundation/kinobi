import {
  Context,
  mapSerializer,
  Option,
  PublicKey,
  Serializer,
} from '@metaplex-foundation/umi';
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
  supplySnapshot: Option<number | bigint>;
  reservations: Array<ReservationV1Args>;
};

export function getReservationListV1AccountDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<ReservationListV1AccountDataArgs, ReservationListV1AccountData> {
  const s = context.serializer;
  return mapSerializer<
    ReservationListV1AccountDataArgs,
    ReservationListV1AccountData,
    ReservationListV1AccountData
  >(
    s.struct<ReservationListV1AccountData>(
      [
        ['key', getTmKeySerializer(context)],
        ['masterEdition', s.publicKey()],
        ['supplySnapshot', s.option(s.u64())],
        ['reservations', s.array(getReservationV1Serializer(context))],
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
