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
  Pda,
  PublicKey,
  RpcAccount,
  RpcGetAccountOptions,
  RpcGetAccountsOptions,
  assertAccountExists,
  deserializeAccount,
  gpaBuilder,
  publicKey as toPublicKey,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  mapSerializer,
  publicKey as publicKeySerializer,
  string,
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import {
  DelegateRole,
  DelegateRoleArgs,
  TmKey,
  TmKeyArgs,
  getDelegateRoleSerializer,
  getTmKeySerializer,
} from '../types';

export type DelegateRecord = Account<DelegateRecordAccountData>;

export type DelegateRecordAccountData = {
  key: TmKey;
  role: DelegateRole;
  bump: number;
};

export type DelegateRecordAccountDataArgs = {
  role: DelegateRoleArgs;
  bump: number;
};

/** @deprecated Use `getDelegateRecordAccountDataSerializer()` without any argument instead. */
export function getDelegateRecordAccountDataSerializer(
  _context: object
): Serializer<DelegateRecordAccountDataArgs, DelegateRecordAccountData>;
export function getDelegateRecordAccountDataSerializer(): Serializer<
  DelegateRecordAccountDataArgs,
  DelegateRecordAccountData
>;
export function getDelegateRecordAccountDataSerializer(
  _context: object = {}
): Serializer<DelegateRecordAccountDataArgs, DelegateRecordAccountData> {
  return mapSerializer<
    DelegateRecordAccountDataArgs,
    any,
    DelegateRecordAccountData
  >(
    struct<DelegateRecordAccountData>(
      [
        ['key', getTmKeySerializer()],
        ['role', getDelegateRoleSerializer()],
        ['bump', u8()],
      ],
      { description: 'DelegateRecordAccountData' }
    ),
    (value) => ({ ...value, key: TmKey.Delegate })
  ) as Serializer<DelegateRecordAccountDataArgs, DelegateRecordAccountData>;
}

/** @deprecated Use `deserializeDelegateRecord(rawAccount)` without any context instead. */
export function deserializeDelegateRecord(
  context: object,
  rawAccount: RpcAccount
): DelegateRecord;
export function deserializeDelegateRecord(
  rawAccount: RpcAccount
): DelegateRecord;
export function deserializeDelegateRecord(
  context: RpcAccount | object,
  rawAccount?: RpcAccount
): DelegateRecord {
  return deserializeAccount(
    rawAccount ?? (context as RpcAccount),
    getDelegateRecordAccountDataSerializer()
  );
}

export async function fetchDelegateRecord(
  context: Pick<Context, 'rpc'>,
  publicKey: PublicKey | Pda,
  options?: RpcGetAccountOptions
): Promise<DelegateRecord> {
  const maybeAccount = await context.rpc.getAccount(
    toPublicKey(publicKey, false),
    options
  );
  assertAccountExists(maybeAccount, 'DelegateRecord');
  return deserializeDelegateRecord(maybeAccount);
}

export async function safeFetchDelegateRecord(
  context: Pick<Context, 'rpc'>,
  publicKey: PublicKey | Pda,
  options?: RpcGetAccountOptions
): Promise<DelegateRecord | null> {
  const maybeAccount = await context.rpc.getAccount(
    toPublicKey(publicKey, false),
    options
  );
  return maybeAccount.exists ? deserializeDelegateRecord(maybeAccount) : null;
}

export async function fetchAllDelegateRecord(
  context: Pick<Context, 'rpc'>,
  publicKeys: Array<PublicKey | Pda>,
  options?: RpcGetAccountsOptions
): Promise<DelegateRecord[]> {
  const maybeAccounts = await context.rpc.getAccounts(
    publicKeys.map((key) => toPublicKey(key, false)),
    options
  );
  return maybeAccounts.map((maybeAccount) => {
    assertAccountExists(maybeAccount, 'DelegateRecord');
    return deserializeDelegateRecord(maybeAccount);
  });
}

export async function safeFetchAllDelegateRecord(
  context: Pick<Context, 'rpc'>,
  publicKeys: Array<PublicKey | Pda>,
  options?: RpcGetAccountsOptions
): Promise<DelegateRecord[]> {
  const maybeAccounts = await context.rpc.getAccounts(
    publicKeys.map((key) => toPublicKey(key, false)),
    options
  );
  return maybeAccounts
    .filter((maybeAccount) => maybeAccount.exists)
    .map((maybeAccount) =>
      deserializeDelegateRecord(maybeAccount as RpcAccount)
    );
}

export function getDelegateRecordGpaBuilder(
  context: Pick<Context, 'rpc' | 'programs'>
) {
  const programId = context.programs.getPublicKey(
    'mplTokenMetadata',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );
  return gpaBuilder(context, programId)
    .registerFields<{ key: TmKeyArgs; role: DelegateRoleArgs; bump: number }>({
      key: [0, getTmKeySerializer()],
      role: [1, getDelegateRoleSerializer()],
      bump: [2, u8()],
    })
    .deserializeUsing<DelegateRecord>((account) =>
      deserializeDelegateRecord(account)
    )
    .whereField('key', TmKey.Delegate);
}

export function getDelegateRecordSize(): number {
  return 282;
}

export function findDelegateRecordPda(
  context: Pick<Context, 'eddsa' | 'programs'>,
  seeds: {
    /** The delegate role */
    role: DelegateRoleArgs;
  }
): Pda {
  const programId = context.programs.getPublicKey(
    'mplTokenMetadata',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );
  return context.eddsa.findPda(programId, [
    string({ size: 'variable' }).serialize('delegate_record'),
    publicKeySerializer().serialize(programId),
    getDelegateRoleSerializer().serialize(seeds.role),
  ]);
}

export async function fetchDelegateRecordFromSeeds(
  context: Pick<Context, 'eddsa' | 'programs' | 'rpc'>,
  seeds: Parameters<typeof findDelegateRecordPda>[1],
  options?: RpcGetAccountOptions
): Promise<DelegateRecord> {
  return fetchDelegateRecord(
    context,
    findDelegateRecordPda(context, seeds),
    options
  );
}

export async function safeFetchDelegateRecordFromSeeds(
  context: Pick<Context, 'eddsa' | 'programs' | 'rpc'>,
  seeds: Parameters<typeof findDelegateRecordPda>[1],
  options?: RpcGetAccountOptions
): Promise<DelegateRecord | null> {
  return safeFetchDelegateRecord(
    context,
    findDelegateRecordPda(context, seeds),
    options
  );
}