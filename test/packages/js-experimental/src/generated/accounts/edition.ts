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
  assertAccountExists,
  decodeAccount,
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
import { Context } from '../shared';
import { TmKey, TmKeyArgs, getTmKeyDecoder, getTmKeyEncoder } from '../types';

export type Edition<TAddress extends string = string> = Account<
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

export function getEditionAccountDataEncoder() {
  return mapEncoder(
    getStructEncoder<{
      key: TmKeyArgs;
      parent: Address;
      edition: number | bigint;
    }>([
      ['key', getTmKeyEncoder()],
      ['parent', getAddressEncoder()],
      ['edition', getU64Encoder()],
    ]),
    (value) => ({ ...value, key: TmKey.EditionV1 })
  ) satisfies Encoder<EditionAccountDataArgs>;
}

export function getEditionAccountDataDecoder() {
  return getStructDecoder<EditionAccountData>([
    ['key', getTmKeyDecoder()],
    ['parent', getAddressDecoder()],
    ['edition', getU64Decoder()],
  ]) satisfies Decoder<EditionAccountData>;
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
): Edition<TAddress> {
  return decodeAccount(encodedAccount, getEditionAccountDataDecoder());
}

export async function fetchEdition<TAddress extends string = string>(
  context: Pick<Context, 'fetchEncodedAccount'>,
  address: Address<TAddress>,
  options?: FetchAccountConfig
): Promise<Edition<TAddress>> {
  const maybeAccount = await context.fetchEncodedAccount(address, options);
  assertAccountExists(maybeAccount);
  return decodeEdition(maybeAccount);
}

export async function safeFetchEdition<TAddress extends string = string>(
  context: Pick<Context, 'fetchEncodedAccount'>,
  address: Address<TAddress>,
  options?: FetchAccountConfig
): Promise<Edition<TAddress> | null> {
  const maybeAccount = await context.fetchEncodedAccount(address, options);
  return maybeAccount.exists ? decodeEdition(maybeAccount) : null;
}

export async function fetchAllEdition(
  context: Pick<Context, 'fetchEncodedAccounts'>,
  addresses: Array<Address>,
  options?: FetchAccountsConfig
): Promise<Edition[]> {
  const maybeAccounts = await context.fetchEncodedAccounts(addresses, options);
  return maybeAccounts.map((maybeAccount) => {
    assertAccountExists(maybeAccount);
    return decodeEdition(maybeAccount);
  });
}

export async function safeFetchAllEdition(
  context: Pick<Context, 'fetchEncodedAccounts'>,
  addresses: Array<Address>,
  options?: FetchAccountsConfig
): Promise<Edition[]> {
  const maybeAccounts = await context.fetchEncodedAccounts(addresses, options);
  return maybeAccounts
    .filter((maybeAccount) => maybeAccount.exists)
    .map((maybeAccount) => decodeEdition(maybeAccount as EncodedAccount));
}

export function getEditionSize(): number {
  return 41;
}
