/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Key, KeyArgs, getKeySerializer } from '../types';
import {
  Account,
  Context,
  PublicKey,
  RpcAccount,
  Serializer,
  assertAccountExists,
  deserializeAccount,
} from '@lorisleiva/js-core';

export type UseAuthorityRecord = {
  key: Key;
  allowedUses: bigint;
  bump: number;
};
export type UseAuthorityRecordArgs = {
  key: KeyArgs;
  allowedUses: number | bigint;
  bump: number;
};

export async function fetchUseAuthorityRecord(
  context: Pick<Context, 'rpc' | 'serializer'>,
  address: PublicKey
): Promise<Account<UseAuthorityRecord>> {
  const maybeAccount = await context.rpc.getAccount(address);
  assertAccountExists(maybeAccount, 'UseAuthorityRecord');
  return deserializeUseAuthorityRecord(context, maybeAccount);
}

export async function safeFetchUseAuthorityRecord(
  context: Pick<Context, 'rpc' | 'serializer'>,
  address: PublicKey
): Promise<Account<UseAuthorityRecord> | null> {
  const maybeAccount = await context.rpc.getAccount(address);
  return maybeAccount.exists
    ? deserializeUseAuthorityRecord(context, maybeAccount)
    : null;
}

export function deserializeUseAuthorityRecord(
  context: Pick<Context, 'serializer'>,
  rawAccount: RpcAccount
): Account<UseAuthorityRecord> {
  return deserializeAccount(
    rawAccount,
    getUseAuthorityRecordSerializer(context)
  );
}

export function getUseAuthorityRecordSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<UseAuthorityRecordArgs, UseAuthorityRecord> {
  const s = context.serializer;
  return s.struct<UseAuthorityRecord>(
    [
      ['key', getKeySerializer(context)],
      ['allowedUses', s.u64],
      ['bump', s.u8],
    ],
    'UseAuthorityRecord'
  ) as Serializer<UseAuthorityRecordArgs, UseAuthorityRecord>;
}
