/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Account,
  EncodedAccount,
  FetchAccountConfig,
  FetchAccountsConfig,
  MaybeAccount,
  MaybeEncodedAccount,
  assertAccountExists,
  assertAccountsExist,
  decodeAccount,
  fetchEncodedAccount,
  fetchEncodedAccounts,
} from '@solana/accounts';
import {
  Address,
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
  getStructDecoder,
  getStructEncoder,
} from '@solana/codecs-data-structures';
import { getU64Decoder, getU64Encoder } from '@solana/codecs-numbers';
import { TmKey, getTmKeyDecoder, getTmKeyEncoder } from '../types';

export type Edition<TAddress extends string = string> = Account<
  EditionAccountData,
  TAddress
>;

export type MaybeEdition<TAddress extends string = string> = MaybeAccount<
  EditionAccountData,
  TAddress
>;

export type EditionAccountData = {
  key: TmKey;
  parent: Address;
  edition: bigint;
};

export type EditionAccountDataArgs = {
  parent: Address;
  edition: number | bigint;
};

export function getEditionAccountDataEncoder(): Encoder<EditionAccountDataArgs> {
  return mapEncoder(
    getStructEncoder([
      ['key', getTmKeyEncoder()],
      ['parent', getAddressEncoder()],
      ['edition', getU64Encoder()],
    ]),
    (value) => ({ ...value, key: TmKey.EditionV1 })
  );
}

export function getEditionAccountDataDecoder(): Decoder<EditionAccountData> {
  return getStructDecoder([
    ['key', getTmKeyDecoder()],
    ['parent', getAddressDecoder()],
    ['edition', getU64Decoder()],
  ]);
}

export function getEditionAccountDataCodec(): Codec<
  EditionAccountDataArgs,
  EditionAccountData
> {
  return combineCodec(
    getEditionAccountDataEncoder(),
    getEditionAccountDataDecoder()
  );
}

export function decodeEdition<TAddress extends string = string>(
  encodedAccount: EncodedAccount<TAddress>
): Edition<TAddress>;
export function decodeEdition<TAddress extends string = string>(
  encodedAccount: MaybeEncodedAccount<TAddress>
): MaybeEdition<TAddress>;
export function decodeEdition<TAddress extends string = string>(
  encodedAccount: EncodedAccount<TAddress> | MaybeEncodedAccount<TAddress>
): Edition<TAddress> | MaybeEdition<TAddress> {
  return decodeAccount(
    encodedAccount as MaybeEncodedAccount<TAddress>,
    getEditionAccountDataDecoder()
  );
}

export async function fetchEdition<TAddress extends string = string>(
  rpc: Parameters<typeof fetchEncodedAccount>[0],
  address: Address<TAddress>,
  config?: FetchAccountConfig
): Promise<Edition<TAddress>> {
  const maybeAccount = await fetchMaybeEdition(rpc, address, config);
  assertAccountExists(maybeAccount);
  return maybeAccount;
}

export async function fetchMaybeEdition<TAddress extends string = string>(
  rpc: Parameters<typeof fetchEncodedAccount>[0],
  address: Address<TAddress>,
  config?: FetchAccountConfig
): Promise<MaybeEdition<TAddress>> {
  const maybeAccount = await fetchEncodedAccount(rpc, address, config);
  return decodeEdition(maybeAccount);
}

export async function fetchAllEdition(
  rpc: Parameters<typeof fetchEncodedAccounts>[0],
  addresses: Array<Address>,
  config?: FetchAccountsConfig
): Promise<Edition[]> {
  const maybeAccounts = await fetchAllMaybeEdition(rpc, addresses, config);
  assertAccountsExist(maybeAccounts);
  return maybeAccounts;
}

export async function fetchAllMaybeEdition(
  rpc: Parameters<typeof fetchEncodedAccounts>[0],
  addresses: Array<Address>,
  config?: FetchAccountsConfig
): Promise<MaybeEdition[]> {
  const maybeAccounts = await fetchEncodedAccounts(rpc, addresses, config);
  return maybeAccounts.map((maybeAccount) => decodeEdition(maybeAccount));
}

export function getEditionSize(): number {
  return 41;
}
