/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Key,
  Reservation,
  getKeySerializer,
  getReservationSerializer,
} from '../types';
import {
  Account,
  Context,
  Option,
  PublicKey,
  RpcAccount,
  Serializer,
  assertAccountExists,
  deserializeAccount,
} from '@lorisleiva/js-core';

export type ReservationListV2 = {
  key: Key;
  masterEdition: PublicKey;
  supplySnapshot: Option<bigint>;
  reservations: Array<Reservation>;
  totalReservationSpots: bigint;
  currentReservationSpots: bigint;
};

export async function fetchReservationListV2(
  context: Pick<Context, 'rpc' | 'serializer'>,
  address: PublicKey
): Promise<Account<ReservationListV2>> {
  const maybeAccount = await context.rpc.getAccount(address);
  assertAccountExists(maybeAccount, 'ReservationListV2');
  return deserializeReservationListV2(context, maybeAccount);
}

export async function safeFetchReservationListV2(
  context: Pick<Context, 'rpc' | 'serializer'>,
  address: PublicKey
): Promise<Account<ReservationListV2> | null> {
  const maybeAccount = await context.rpc.getAccount(address);
  return maybeAccount.exists
    ? deserializeReservationListV2(context, maybeAccount)
    : null;
}

export function deserializeReservationListV2(
  context: Pick<Context, 'serializer'>,
  rawAccount: RpcAccount
): Account<ReservationListV2> {
  return deserializeAccount(
    rawAccount,
    getReservationListV2Serializer(context)
  );
}

export function getReservationListV2Serializer(
  context: Pick<Context, 'serializer'>
): Serializer<ReservationListV2> {
  const s = context.serializer;
  return s.struct<ReservationListV2>(
    [
      ['key', getKeySerializer(context)],
      ['masterEdition', s.publicKey],
      ['supplySnapshot', s.option(s.u64)],
      ['reservations', s.vec(getReservationSerializer(context))],
      ['totalReservationSpots', s.u64],
      ['currentReservationSpots', s.u64],
    ],
    'ReservationListV2'
  );
}
