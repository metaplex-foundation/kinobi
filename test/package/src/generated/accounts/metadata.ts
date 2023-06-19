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
  Option,
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
import {
  Collection,
  CollectionArgs,
  CollectionDetails,
  CollectionDetailsArgs,
  Creator,
  CreatorArgs,
  DelegateState,
  DelegateStateArgs,
  ProgrammableConfig,
  ProgrammableConfigArgs,
  TmKey,
  TmKeyArgs,
  TokenStandard,
  TokenStandardArgs,
  Uses,
  UsesArgs,
  getCollectionDetailsSerializer,
  getCollectionSerializer,
  getCreatorSerializer,
  getDelegateStateSerializer,
  getProgrammableConfigSerializer,
  getTmKeySerializer,
  getTokenStandardSerializer,
  getUsesSerializer,
} from '../types';

export type Metadata = Account<MetadataAccountData>;

export type MetadataAccountData = {
  key: TmKey;
  updateAuthority: PublicKey;
  mint: PublicKey;
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Option<Array<Creator>>;
  primarySaleHappened: boolean;
  isMutable: boolean;
  editionNonce: Option<number>;
  tokenStandard: Option<TokenStandard>;
  collection: Option<Collection>;
  uses: Option<Uses>;
  collectionDetails: Option<CollectionDetails>;
  programmableConfig: Option<ProgrammableConfig>;
  delegateState: Option<DelegateState>;
};

export type MetadataAccountDataArgs = {
  updateAuthority: PublicKey;
  mint: PublicKey;
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Option<Array<CreatorArgs>>;
  primarySaleHappened: boolean;
  isMutable: boolean;
  editionNonce: Option<number>;
  tokenStandard: Option<TokenStandardArgs>;
  collection: Option<CollectionArgs>;
  uses: Option<UsesArgs>;
  collectionDetails: Option<CollectionDetailsArgs>;
  programmableConfig: Option<ProgrammableConfigArgs>;
  delegateState: Option<DelegateStateArgs>;
};

export function getMetadataAccountDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<MetadataAccountDataArgs, MetadataAccountData> {
  const s = context.serializer;
  return mapSerializer<MetadataAccountDataArgs, any, MetadataAccountData>(
    s.struct<MetadataAccountData>(
      [
        ['key', getTmKeySerializer(context)],
        ['updateAuthority', s.publicKey()],
        ['mint', s.publicKey()],
        ['name', s.string()],
        ['symbol', s.string()],
        ['uri', s.string()],
        ['sellerFeeBasisPoints', s.u16()],
        ['creators', s.option(s.array(getCreatorSerializer(context)))],
        ['primarySaleHappened', s.bool()],
        ['isMutable', s.bool()],
        ['editionNonce', s.option(s.u8())],
        ['tokenStandard', s.option(getTokenStandardSerializer(context))],
        ['collection', s.option(getCollectionSerializer(context))],
        ['uses', s.option(getUsesSerializer(context))],
        [
          'collectionDetails',
          s.option(getCollectionDetailsSerializer(context)),
        ],
        [
          'programmableConfig',
          s.option(getProgrammableConfigSerializer(context)),
        ],
        ['delegateState', s.option(getDelegateStateSerializer(context))],
      ],
      { description: 'MetadataAccountData' }
    ),
    (value) => ({ ...value, key: TmKey.MetadataV1 })
  ) as Serializer<MetadataAccountDataArgs, MetadataAccountData>;
}

export function deserializeMetadata(
  context: Pick<Context, 'serializer'>,
  rawAccount: RpcAccount
): Metadata {
  return deserializeAccount(
    rawAccount,
    getMetadataAccountDataSerializer(context)
  );
}

export async function fetchMetadata(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKey: PublicKey | Pda,
  options?: RpcGetAccountOptions
): Promise<Metadata> {
  const maybeAccount = await context.rpc.getAccount(
    toPublicKey(publicKey, false),
    options
  );
  assertAccountExists(maybeAccount, 'Metadata');
  return deserializeMetadata(context, maybeAccount);
}

export async function safeFetchMetadata(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKey: PublicKey | Pda,
  options?: RpcGetAccountOptions
): Promise<Metadata | null> {
  const maybeAccount = await context.rpc.getAccount(
    toPublicKey(publicKey, false),
    options
  );
  return maybeAccount.exists
    ? deserializeMetadata(context, maybeAccount)
    : null;
}

export async function fetchAllMetadata(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKeys: Array<PublicKey | Pda>,
  options?: RpcGetAccountsOptions
): Promise<Metadata[]> {
  const maybeAccounts = await context.rpc.getAccounts(
    publicKeys.map((key) => toPublicKey(key, false)),
    options
  );
  return maybeAccounts.map((maybeAccount) => {
    assertAccountExists(maybeAccount, 'Metadata');
    return deserializeMetadata(context, maybeAccount);
  });
}

export async function safeFetchAllMetadata(
  context: Pick<Context, 'rpc' | 'serializer'>,
  publicKeys: Array<PublicKey | Pda>,
  options?: RpcGetAccountsOptions
): Promise<Metadata[]> {
  const maybeAccounts = await context.rpc.getAccounts(
    publicKeys.map((key) => toPublicKey(key, false)),
    options
  );
  return maybeAccounts
    .filter((maybeAccount) => maybeAccount.exists)
    .map((maybeAccount) =>
      deserializeMetadata(context, maybeAccount as RpcAccount)
    );
}

export function getMetadataGpaBuilder(
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
      updateAuthority: PublicKey;
      mint: PublicKey;
      name: string;
      symbol: string;
      uri: string;
      sellerFeeBasisPoints: number;
      creators: Option<Array<CreatorArgs>>;
      primarySaleHappened: boolean;
      isMutable: boolean;
      editionNonce: Option<number>;
      tokenStandard: Option<TokenStandardArgs>;
      collection: Option<CollectionArgs>;
      uses: Option<UsesArgs>;
      collectionDetails: Option<CollectionDetailsArgs>;
      programmableConfig: Option<ProgrammableConfigArgs>;
      delegateState: Option<DelegateStateArgs>;
    }>({
      key: [0, getTmKeySerializer(context)],
      updateAuthority: [1, s.publicKey()],
      mint: [33, s.publicKey()],
      name: [65, s.string()],
      symbol: [null, s.string()],
      uri: [null, s.string()],
      sellerFeeBasisPoints: [null, s.u16()],
      creators: [null, s.option(s.array(getCreatorSerializer(context)))],
      primarySaleHappened: [null, s.bool()],
      isMutable: [null, s.bool()],
      editionNonce: [null, s.option(s.u8())],
      tokenStandard: [null, s.option(getTokenStandardSerializer(context))],
      collection: [null, s.option(getCollectionSerializer(context))],
      uses: [null, s.option(getUsesSerializer(context))],
      collectionDetails: [
        null,
        s.option(getCollectionDetailsSerializer(context)),
      ],
      programmableConfig: [
        null,
        s.option(getProgrammableConfigSerializer(context)),
      ],
      delegateState: [null, s.option(getDelegateStateSerializer(context))],
    })
    .deserializeUsing<Metadata>((account) =>
      deserializeMetadata(context, account)
    )
    .whereField('key', TmKey.MetadataV1);
}

export function getMetadataSize(): number {
  return 679;
}

export function findMetadataPda(
  context: Pick<Context, 'eddsa' | 'programs' | 'serializer'>,
  seeds: {
    /** The address of the mint account */
    mint: PublicKey;
  }
): Pda {
  const s = context.serializer;
  const programId = context.programs.getPublicKey(
    'mplTokenMetadata',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );
  return context.eddsa.findPda(programId, [
    s.string({ size: 'variable' }).serialize('metadata'),
    s.publicKey().serialize(programId),
    s.publicKey().serialize(seeds.mint),
  ]);
}

export async function fetchMetadataFromSeeds(
  context: Pick<Context, 'eddsa' | 'programs' | 'rpc' | 'serializer'>,
  seeds: Parameters<typeof findMetadataPda>[1],
  options?: RpcGetAccountOptions
): Promise<Metadata> {
  return fetchMetadata(context, findMetadataPda(context, seeds), options);
}

export async function safeFetchMetadataFromSeeds(
  context: Pick<Context, 'eddsa' | 'programs' | 'rpc' | 'serializer'>,
  seeds: Parameters<typeof findMetadataPda>[1],
  options?: RpcGetAccountOptions
): Promise<Metadata | null> {
  return safeFetchMetadata(context, findMetadataPda(context, seeds), options);
}
