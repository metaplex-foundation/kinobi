import {
  Context,
  gpaBuilder,
  mapSerializer,
  Option,
  PublicKey,
  Serializer,
} from '@metaplex-foundation/umi';
import {
  deserializeReservationListV1,
  getReservationV1Serializer,
  getTmKeySerializer,
  ReservationListV1,
  ReservationV1,
  ReservationV1Args,
  TmKey,
  TmKeyArgs,
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

export function getReservationListV1GpaBuilder(
  context: Pick<Context, 'rpc' | 'serializer' | 'programs'>
) {
  const s = context.serializer;
  const programId = context.programs.get('mplTokenMetadata').publicKey;
  return gpaBuilder(context, programId)
    .registerFieldsFromStruct<{
      key: TmKeyArgs;
      masterEdition: PublicKey;
      supplySnapshot: Option<number | bigint>;
      reservations: Array<ReservationV1Args>;
    }>([
      ['key', getTmKeySerializer(context)],
      ['masterEdition', s.publicKey()],
      ['supplySnapshot', s.option(s.u64())],
      ['reservations', s.array(getReservationV1Serializer(context))],
    ])
    .deserializeUsing<ReservationListV1>((account) =>
      deserializeReservationListV1(context, account)
    )
    .whereField('key', TmKey.ReservationListV1);
}
