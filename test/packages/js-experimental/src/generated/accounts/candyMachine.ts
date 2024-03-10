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
  getArrayDecoder,
  getArrayEncoder,
  getStructDecoder,
  getStructEncoder,
  getU64Decoder,
  getU64Encoder,
  getU8Decoder,
  getU8Encoder,
  mapEncoder,
} from '@solana/codecs';
import {
  CandyMachineData,
  CandyMachineDataArgs,
  getCandyMachineDataDecoder,
  getCandyMachineDataEncoder,
} from '../types';

export type CandyMachine<TAddress extends string = string> = Account<
  CandyMachineAccountData,
  TAddress
>;

export type MaybeCandyMachine<TAddress extends string = string> = MaybeAccount<
  CandyMachineAccountData,
  TAddress
>;

export type CandyMachineAccountData = {
  discriminator: Array<number>;
  /** Features versioning flags. */
  features: bigint;
  /** Authority address. */
  authority: Address;
  /** Authority address allowed to mint from the candy machine. */
  mintAuthority: Address;
  /** The collection mint for the candy machine. */
  collectionMint: Address;
  /** Number of assets redeemed. */
  itemsRedeemed: bigint;
  /** Candy machine configuration data. */
  data: CandyMachineData;
};

export type CandyMachineAccountDataArgs = {
  /** Features versioning flags. */
  features: number | bigint;
  /** Authority address. */
  authority: Address;
  /** Authority address allowed to mint from the candy machine. */
  mintAuthority: Address;
  /** The collection mint for the candy machine. */
  collectionMint: Address;
  /** Number of assets redeemed. */
  itemsRedeemed: number | bigint;
  /** Candy machine configuration data. */
  data: CandyMachineDataArgs;
};

export function getCandyMachineAccountDataEncoder(): Encoder<CandyMachineAccountDataArgs> {
  return mapEncoder(
    getStructEncoder([
      ['discriminator', getArrayEncoder(getU8Encoder(), { size: 8 })],
      ['features', getU64Encoder()],
      ['authority', getAddressEncoder()],
      ['mintAuthority', getAddressEncoder()],
      ['collectionMint', getAddressEncoder()],
      ['itemsRedeemed', getU64Encoder()],
      ['data', getCandyMachineDataEncoder()],
    ]),
    (value) => ({
      ...value,
      discriminator: [51, 173, 177, 113, 25, 241, 109, 189],
    })
  );
}

export function getCandyMachineAccountDataDecoder(): Decoder<CandyMachineAccountData> {
  return getStructDecoder([
    ['discriminator', getArrayDecoder(getU8Decoder(), { size: 8 })],
    ['features', getU64Decoder()],
    ['authority', getAddressDecoder()],
    ['mintAuthority', getAddressDecoder()],
    ['collectionMint', getAddressDecoder()],
    ['itemsRedeemed', getU64Decoder()],
    ['data', getCandyMachineDataDecoder()],
  ]);
}

export function getCandyMachineAccountDataCodec(): Codec<
  CandyMachineAccountDataArgs,
  CandyMachineAccountData
> {
  return combineCodec(
    getCandyMachineAccountDataEncoder(),
    getCandyMachineAccountDataDecoder()
  );
}

export function decodeCandyMachine<TAddress extends string = string>(
  encodedAccount: EncodedAccount<TAddress>
): CandyMachine<TAddress>;
export function decodeCandyMachine<TAddress extends string = string>(
  encodedAccount: MaybeEncodedAccount<TAddress>
): MaybeCandyMachine<TAddress>;
export function decodeCandyMachine<TAddress extends string = string>(
  encodedAccount: EncodedAccount<TAddress> | MaybeEncodedAccount<TAddress>
): CandyMachine<TAddress> | MaybeCandyMachine<TAddress> {
  return decodeAccount(
    encodedAccount as MaybeEncodedAccount<TAddress>,
    getCandyMachineAccountDataDecoder()
  );
}

export async function fetchCandyMachine<TAddress extends string = string>(
  rpc: Parameters<typeof fetchEncodedAccount>[0],
  address: Address<TAddress>,
  config?: FetchAccountConfig
): Promise<CandyMachine<TAddress>> {
  const maybeAccount = await fetchMaybeCandyMachine(rpc, address, config);
  assertAccountExists(maybeAccount);
  return maybeAccount;
}

export async function fetchMaybeCandyMachine<TAddress extends string = string>(
  rpc: Parameters<typeof fetchEncodedAccount>[0],
  address: Address<TAddress>,
  config?: FetchAccountConfig
): Promise<MaybeCandyMachine<TAddress>> {
  const maybeAccount = await fetchEncodedAccount(rpc, address, config);
  return decodeCandyMachine(maybeAccount);
}

export async function fetchAllCandyMachine(
  rpc: Parameters<typeof fetchEncodedAccounts>[0],
  addresses: Array<Address>,
  config?: FetchAccountsConfig
): Promise<CandyMachine[]> {
  const maybeAccounts = await fetchAllMaybeCandyMachine(rpc, addresses, config);
  assertAccountsExist(maybeAccounts);
  return maybeAccounts;
}

export async function fetchAllMaybeCandyMachine(
  rpc: Parameters<typeof fetchEncodedAccounts>[0],
  addresses: Array<Address>,
  config?: FetchAccountsConfig
): Promise<MaybeCandyMachine[]> {
  const maybeAccounts = await fetchEncodedAccounts(rpc, addresses, config);
  return maybeAccounts.map((maybeAccount) => decodeCandyMachine(maybeAccount));
}
