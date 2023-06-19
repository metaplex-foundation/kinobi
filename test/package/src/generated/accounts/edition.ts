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
} from '@metaplex-foundation/umi/serializers';
import { TmKey, TmKeyArgs, getTmKeySerializer } from '../types';

export type Edition = Account<EditionAccountData>;

export type EditionAccountData = {
  key: TmKey;
  parent: PublicKey;
  edition: bigint;
};

export type EditionAccountDataArgs = {
  parent: PublicKey;
  edition: number | bigint;
};

export function getEditionAccountDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<EditionAccountDataArgs, EditionAccountData> {
  const s = context.serializer;
  return mapSerializer<EditionAccountDataArgs, any, EditionAccountData>(
    s.struct<EditionAccountData>(
      [
        ['key', getTmKeySerializer(context)],
        ['parent', s.publicKey()],
        ['edition', s.u64()],
      ],
      { description: 'EditionAccountData' }
    ),
    (value) => ({ ...value, key: TmKey.EditionV1 })
  ) as Serializer<EditionAccountDataArgs, EditionAccountData>;
}

export function deserializeEdition(
  context: Pick<Context, 'serializer'>,
  rawAccount: RpcAccount
): Edition {
  return deserializeAccount(
    rawAccount,
    getEditionAccountDataSerializer(context)
  );
}

export async function fetchEdition(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKey: PublicKey | Pda,
  options?: RpcGetAccountOptions
): Promise<Edition> {
  const maybeAccount = await context.rpc.getAccount(
    toPublicKey(publicKey, false),
    options
  );
  assertAccountExists(maybeAccount, 'Edition');
  return deserializeEdition(context, maybeAccount);
}

export async function safeFetchEdition(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKey: PublicKey | Pda,
  options?: RpcGetAccountOptions
): Promise<Edition | null> {
  const maybeAccount = await context.rpc.getAccount(
    toPublicKey(publicKey, false),
    options
  );
  return maybeAccount.exists ? deserializeEdition(context, maybeAccount) : null;
}

export async function fetchAllEdition(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKeys: Array<PublicKey | Pda>,
  options?: RpcGetAccountsOptions
): Promise<Edition[]> {
  const maybeAccounts = await context.rpc.getAccounts(
    publicKeys.map((key) => toPublicKey(key, false)),
    options
  );
  return maybeAccounts.map((maybeAccount) => {
    assertAccountExists(maybeAccount, 'Edition');
    return deserializeEdition(context, maybeAccount);
  });
}

export async function safeFetchAllEdition(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKeys: Array<PublicKey | Pda>,
  options?: RpcGetAccountsOptions
): Promise<Edition[]> {
  const maybeAccounts = await context.rpc.getAccounts(
    publicKeys.map((key) => toPublicKey(key, false)),
    options
  );
  return maybeAccounts
    .filter((maybeAccount) => maybeAccount.exists)
    .map((maybeAccount) =>
      deserializeEdition(context, maybeAccount as RpcAccount)
    );
}

export function getEditionGpaBuilder(
  context: Pick<Context, 'rpc' | 'serializer' | 'programs'>
) {
  const s = context.serializer;
  const programId = context.programs.getPublicKey(
    'mplTokenMetadata',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );
  return gpaBuilder(context, programId)
    .registerFields<{
      key: TmKeyArgs;
      parent: PublicKey;
      edition: number | bigint;
    }>({
      key: [0, getTmKeySerializer(context)],
      parent: [1, s.publicKey()],
      edition: [33, s.u64()],
    })
    .deserializeUsing<Edition>((account) =>
      deserializeEdition(context, account)
    )
    .whereField('key', TmKey.EditionV1);
}

export function getEditionSize(): number {
  return 41;
}
