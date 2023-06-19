/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Context, PublicKey } from '@metaplex-foundation/umi';
import { Serializer } from '@metaplex-foundation/umi/serializers';

export type Reservation = {
  address: PublicKey;
  spotsRemaining: bigint;
  totalSpots: bigint;
};

export type ReservationArgs = {
  address: PublicKey;
  spotsRemaining: number | bigint;
  totalSpots: number | bigint;
};

export function getReservationSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<ReservationArgs, Reservation> {
  const s = context.serializer;
  return s.struct<Reservation>(
    [
      ['address', s.publicKey()],
      ['spotsRemaining', s.u64()],
      ['totalSpots', s.u64()],
    ],
    { description: 'Reservation' }
  ) as Serializer<ReservationArgs, Reservation>;
}
