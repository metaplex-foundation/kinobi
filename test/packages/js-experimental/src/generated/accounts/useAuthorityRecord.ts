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
import { Address } from '@solana/addresses';
import {
  Codec,
  Decoder,
  Encoder,
  combineCodec,
  getStructDecoder,
  getStructEncoder,
  getU64Decoder,
  getU64Encoder,
  getU8Decoder,
  getU8Encoder,
  mapEncoder,
} from '@solana/codecs';
import { TmKey, getTmKeyDecoder, getTmKeyEncoder } from '../types';

export type UseAuthorityRecord<TAddress extends string = string> = Account<
  UseAuthorityRecordAccountData,
  TAddress
>;

export type MaybeUseAuthorityRecord<TAddress extends string = string> =
  MaybeAccount<UseAuthorityRecordAccountData, TAddress>;

export type UseAuthorityRecordAccountData = {
  key: TmKey;
  allowedUses: bigint;
  bump: number;
};

export type UseAuthorityRecordAccountDataArgs = {
  allowedUses: number | bigint;
  bump: number;
};

export function getUseAuthorityRecordAccountDataEncoder(): Encoder<UseAuthorityRecordAccountDataArgs> {
  return mapEncoder(
    getStructEncoder([
      ['key', getTmKeyEncoder()],
      ['allowedUses', getU64Encoder()],
      ['bump', getU8Encoder()],
    ]),
    (value) => ({ ...value, key: TmKey.UseAuthorityRecord })
  );
}

export function getUseAuthorityRecordAccountDataDecoder(): Decoder<UseAuthorityRecordAccountData> {
  return getStructDecoder([
    ['key', getTmKeyDecoder()],
    ['allowedUses', getU64Decoder()],
    ['bump', getU8Decoder()],
  ]);
}

export function getUseAuthorityRecordAccountDataCodec(): Codec<
  UseAuthorityRecordAccountDataArgs,
  UseAuthorityRecordAccountData
> {
  return combineCodec(
    getUseAuthorityRecordAccountDataEncoder(),
    getUseAuthorityRecordAccountDataDecoder()
  );
}

export function decodeUseAuthorityRecord<TAddress extends string = string>(
  encodedAccount: EncodedAccount<TAddress>
): UseAuthorityRecord<TAddress>;
export function decodeUseAuthorityRecord<TAddress extends string = string>(
  encodedAccount: MaybeEncodedAccount<TAddress>
): MaybeUseAuthorityRecord<TAddress>;
export function decodeUseAuthorityRecord<TAddress extends string = string>(
  encodedAccount: EncodedAccount<TAddress> | MaybeEncodedAccount<TAddress>
): UseAuthorityRecord<TAddress> | MaybeUseAuthorityRecord<TAddress> {
  return decodeAccount(
    encodedAccount as MaybeEncodedAccount<TAddress>,
    getUseAuthorityRecordAccountDataDecoder()
  );
}

export async function fetchUseAuthorityRecord<TAddress extends string = string>(
  rpc: Parameters<typeof fetchEncodedAccount>[0],
  address: Address<TAddress>,
  config?: FetchAccountConfig
): Promise<UseAuthorityRecord<TAddress>> {
  const maybeAccount = await fetchMaybeUseAuthorityRecord(rpc, address, config);
  assertAccountExists(maybeAccount);
  return maybeAccount;
}

export async function fetchMaybeUseAuthorityRecord<
  TAddress extends string = string,
>(
  rpc: Parameters<typeof fetchEncodedAccount>[0],
  address: Address<TAddress>,
  config?: FetchAccountConfig
): Promise<MaybeUseAuthorityRecord<TAddress>> {
  const maybeAccount = await fetchEncodedAccount(rpc, address, config);
  return decodeUseAuthorityRecord(maybeAccount);
}

export async function fetchAllUseAuthorityRecord(
  rpc: Parameters<typeof fetchEncodedAccounts>[0],
  addresses: Array<Address>,
  config?: FetchAccountsConfig
): Promise<UseAuthorityRecord[]> {
  const maybeAccounts = await fetchAllMaybeUseAuthorityRecord(
    rpc,
    addresses,
    config
  );
  assertAccountsExist(maybeAccounts);
  return maybeAccounts;
}

export async function fetchAllMaybeUseAuthorityRecord(
  rpc: Parameters<typeof fetchEncodedAccounts>[0],
  addresses: Array<Address>,
  config?: FetchAccountsConfig
): Promise<MaybeUseAuthorityRecord[]> {
  const maybeAccounts = await fetchEncodedAccounts(rpc, addresses, config);
  return maybeAccounts.map((maybeAccount) =>
    decodeUseAuthorityRecord(maybeAccount)
  );
}

export function getUseAuthorityRecordSize(): number {
  return 10;
}
