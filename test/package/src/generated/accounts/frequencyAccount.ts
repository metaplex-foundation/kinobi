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
  Serializer,
  assertAccountExists,
  deserializeAccount,
  gpaBuilder,
  mapSerializer,
} from '@lorisleiva/js-core';
import { TaKey, getTaKeySerializer } from '../types';

export type FrequencyAccount = Account<FrequencyAccountAccountData>;

export type FrequencyAccountAccountData = {
  /** Test with only one line. */
  key: TaKey;
  /**
   * Test with multiple lines
   * and this is the second line.
   */
  lastUpdate: bigint;
  period: bigint;
};

export type FrequencyAccountAccountArgs = {
  /**
   * Test with multiple lines
   * and this is the second line.
   */
  lastUpdate: number | bigint;
  period: number | bigint;
};

export async function fetchFrequencyAccount(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKey: PublicKey,
  options?: RpcGetAccountOptions
): Promise<FrequencyAccount> {
  const maybeAccount = await context.rpc.getAccount(publicKey, options);
  assertAccountExists(maybeAccount, 'FrequencyAccount');
  return deserializeFrequencyAccount(context, maybeAccount);
}

export async function safeFetchFrequencyAccount(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKey: PublicKey,
  options?: RpcGetAccountOptions
): Promise<FrequencyAccount | null> {
  const maybeAccount = await context.rpc.getAccount(publicKey, options);
  return maybeAccount.exists
    ? deserializeFrequencyAccount(context, maybeAccount)
    : null;
}

export async function fetchAllFrequencyAccount(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKeys: PublicKey[],
  options?: RpcGetAccountsOptions
): Promise<FrequencyAccount[]> {
  const maybeAccounts = await context.rpc.getAccounts(publicKeys, options);
  return maybeAccounts.map((maybeAccount) => {
    assertAccountExists(maybeAccount, 'FrequencyAccount');
    return deserializeFrequencyAccount(context, maybeAccount);
  });
}

export async function safeFetchAllFrequencyAccount(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKeys: PublicKey[],
  options?: RpcGetAccountsOptions
): Promise<FrequencyAccount[]> {
  const maybeAccounts = await context.rpc.getAccounts(publicKeys, options);
  return maybeAccounts
    .filter((maybeAccount) => maybeAccount.exists)
    .map((maybeAccount) =>
      deserializeFrequencyAccount(context, maybeAccount as RpcAccount)
    );
}

export function getFrequencyAccountGpaBuilder(
  context: Pick<Context, 'rpc' | 'serializer' | 'programs'>
) {
  const s = context.serializer;
  const programId = context.programs.get('mplTokenAuthRules').publicKey;
  return gpaBuilder(context, programId)
    .registerFields<{
      key: TaKey;
      lastUpdate: number | bigint;
      period: number | bigint;
    }>([
      ['key', getTaKeySerializer(context)],
      ['lastUpdate', s.i64],
      ['period', s.i64],
    ])
    .deserializeUsing<FrequencyAccount>((account) =>
      deserializeFrequencyAccount(context, account)
    )
    .whereField('key', TaKey.Frequency);
}

export function deserializeFrequencyAccount(
  context: Pick<Context, 'serializer'>,
  rawAccount: RpcAccount
): FrequencyAccount {
  return deserializeAccount(
    rawAccount,
    getFrequencyAccountAccountDataSerializer(context)
  );
}

export function getFrequencyAccountAccountDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<FrequencyAccountAccountArgs, FrequencyAccountAccountData> {
  const s = context.serializer;
  return mapSerializer<
    FrequencyAccountAccountArgs,
    FrequencyAccountAccountData,
    FrequencyAccountAccountData
  >(
    s.struct<FrequencyAccountAccountData>(
      [
        ['key', getTaKeySerializer(context)],
        ['lastUpdate', s.i64],
        ['period', s.i64],
      ],
      'FrequencyAccount'
    ),
    (value) =>
      ({ ...value, key: TaKey.Frequency } as FrequencyAccountAccountData)
  ) as Serializer<FrequencyAccountAccountArgs, FrequencyAccountAccountData>;
}

export function getFrequencyAccountSize(_context = {}): number {
  return 17;
}