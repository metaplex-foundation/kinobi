/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Account,
  Context,
  PublicKey,
  RpcAccount,
  RpcGetAccountOptions,
  RpcGetAccountsOptions,
  assertAccountExists,
  deserializeAccount,
} from '@metaplex-foundation/umi-core';
import {
  ReservationListV1AccountData,
  getReservationListV1AccountDataSerializer,
} from '../../hooked';

export type ReservationListV1 = Account<ReservationListV1AccountData>;

export function deserializeReservationListV1(
  context: Pick<Context, 'serializer'>,
  rawAccount: RpcAccount
): ReservationListV1 {
  return deserializeAccount(
    rawAccount,
    getReservationListV1AccountDataSerializer(context)
  );
}

export async function fetchReservationListV1(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKey: PublicKey,
  options?: RpcGetAccountOptions
): Promise<ReservationListV1> {
  const maybeAccount = await context.rpc.getAccount(publicKey, options);
  assertAccountExists(maybeAccount, 'ReservationListV1');
  return deserializeReservationListV1(context, maybeAccount);
}

export async function safeFetchReservationListV1(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKey: PublicKey,
  options?: RpcGetAccountOptions
): Promise<ReservationListV1 | null> {
  const maybeAccount = await context.rpc.getAccount(publicKey, options);
  return maybeAccount.exists
    ? deserializeReservationListV1(context, maybeAccount)
    : null;
}

export async function fetchAllReservationListV1(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKeys: PublicKey[],
  options?: RpcGetAccountsOptions
): Promise<ReservationListV1[]> {
  const maybeAccounts = await context.rpc.getAccounts(publicKeys, options);
  return maybeAccounts.map((maybeAccount) => {
    assertAccountExists(maybeAccount, 'ReservationListV1');
    return deserializeReservationListV1(context, maybeAccount);
  });
}

export async function safeFetchAllReservationListV1(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKeys: PublicKey[],
  options?: RpcGetAccountsOptions
): Promise<ReservationListV1[]> {
  const maybeAccounts = await context.rpc.getAccounts(publicKeys, options);
  return maybeAccounts
    .filter((maybeAccount) => maybeAccount.exists)
    .map((maybeAccount) =>
      deserializeReservationListV1(context, maybeAccount as RpcAccount)
    );
}

export function getReservationListV1Size(
  context: Pick<Context, 'serializer'>
): number | null {
  return getReservationListV1AccountDataSerializer(context).fixedSize;
}
