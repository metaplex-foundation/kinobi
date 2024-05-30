/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  assertAccountExists,
  assertAccountsExist,
  decodeAccount,
  fetchEncodedAccount,
  fetchEncodedAccounts,
  type Account,
  type Address,
  type EncodedAccount,
  type FetchAccountConfig,
  type FetchAccountsConfig,
  type MaybeAccount,
  type MaybeEncodedAccount,
} from '@solana/web3.js';
import {
  ReservationListV1AccountData,
  getReservationListV1AccountDataDecoder,
} from '../../hooked';

export function decodeReservationListV1<TAddress extends string = string>(
  encodedAccount: EncodedAccount<TAddress>
): Account<ReservationListV1AccountData, TAddress>;
export function decodeReservationListV1<TAddress extends string = string>(
  encodedAccount: MaybeEncodedAccount<TAddress>
): MaybeAccount<ReservationListV1AccountData, TAddress>;
export function decodeReservationListV1<TAddress extends string = string>(
  encodedAccount: EncodedAccount<TAddress> | MaybeEncodedAccount<TAddress>
):
  | Account<ReservationListV1AccountData, TAddress>
  | MaybeAccount<ReservationListV1AccountData, TAddress> {
  return decodeAccount(
    encodedAccount as MaybeEncodedAccount<TAddress>,
    getReservationListV1AccountDataDecoder()
  );
}

export async function fetchReservationListV1<TAddress extends string = string>(
  rpc: Parameters<typeof fetchEncodedAccount>[0],
  address: Address<TAddress>,
  config?: FetchAccountConfig
): Promise<Account<ReservationListV1AccountData, TAddress>> {
  const maybeAccount = await fetchMaybeReservationListV1(rpc, address, config);
  assertAccountExists(maybeAccount);
  return maybeAccount;
}

export async function fetchMaybeReservationListV1<
  TAddress extends string = string,
>(
  rpc: Parameters<typeof fetchEncodedAccount>[0],
  address: Address<TAddress>,
  config?: FetchAccountConfig
): Promise<MaybeAccount<ReservationListV1AccountData, TAddress>> {
  const maybeAccount = await fetchEncodedAccount(rpc, address, config);
  return decodeReservationListV1(maybeAccount);
}

export async function fetchAllReservationListV1(
  rpc: Parameters<typeof fetchEncodedAccounts>[0],
  addresses: Array<Address>,
  config?: FetchAccountsConfig
): Promise<Account<ReservationListV1AccountData>[]> {
  const maybeAccounts = await fetchAllMaybeReservationListV1(
    rpc,
    addresses,
    config
  );
  assertAccountsExist(maybeAccounts);
  return maybeAccounts;
}

export async function fetchAllMaybeReservationListV1(
  rpc: Parameters<typeof fetchEncodedAccounts>[0],
  addresses: Array<Address>,
  config?: FetchAccountsConfig
): Promise<MaybeAccount<ReservationListV1AccountData>[]> {
  const maybeAccounts = await fetchEncodedAccounts(rpc, addresses, config);
  return maybeAccounts.map((maybeAccount) =>
    decodeReservationListV1(maybeAccount)
  );
}
