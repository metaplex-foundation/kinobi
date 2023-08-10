/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  AccountMeta,
  Context,
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  mapSerializer,
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import { addAccountMeta, addObjectProperty } from '../shared';

// Accounts.
export type UnverifyCollectionInstructionAccounts = {
  /** Metadata account */
  metadata: PublicKey | Pda;
  /** Collection Authority */
  collectionAuthority: Signer;
  /** Mint of the Collection */
  collectionMint: PublicKey | Pda;
  /** Metadata Account of the Collection */
  collection: PublicKey | Pda;
  /** MasterEdition2 Account of the Collection Token */
  collectionMasterEditionAccount: PublicKey | Pda;
  /** Collection Authority Record PDA */
  collectionAuthorityRecord?: PublicKey | Pda;
};

// Data.
export type UnverifyCollectionInstructionData = { discriminator: number };

export type UnverifyCollectionInstructionDataArgs = {};

/** @deprecated Use `getUnverifyCollectionInstructionDataSerializer()` without any argument instead. */
export function getUnverifyCollectionInstructionDataSerializer(
  _context: object
): Serializer<
  UnverifyCollectionInstructionDataArgs,
  UnverifyCollectionInstructionData
>;
export function getUnverifyCollectionInstructionDataSerializer(): Serializer<
  UnverifyCollectionInstructionDataArgs,
  UnverifyCollectionInstructionData
>;
export function getUnverifyCollectionInstructionDataSerializer(
  _context: object = {}
): Serializer<
  UnverifyCollectionInstructionDataArgs,
  UnverifyCollectionInstructionData
> {
  return mapSerializer<
    UnverifyCollectionInstructionDataArgs,
    any,
    UnverifyCollectionInstructionData
  >(
    struct<UnverifyCollectionInstructionData>([['discriminator', u8()]], {
      description: 'UnverifyCollectionInstructionData',
    }),
    (value) => ({ ...value, discriminator: 22 })
  ) as Serializer<
    UnverifyCollectionInstructionDataArgs,
    UnverifyCollectionInstructionData
  >;
}

// Instruction.
export function unverifyCollection(
  context: Pick<Context, 'programs'>,
  input: UnverifyCollectionInstructionAccounts
): TransactionBuilder {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplTokenMetadata',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );

  // Resolved inputs.
  const resolvedAccounts = {
    metadata: [input.metadata, true] as const,
    collectionAuthority: [input.collectionAuthority, true] as const,
    collectionMint: [input.collectionMint, false] as const,
    collection: [input.collection, false] as const,
    collectionMasterEditionAccount: [
      input.collectionMasterEditionAccount,
      false,
    ] as const,
  };
  addObjectProperty(
    resolvedAccounts,
    'collectionAuthorityRecord',
    input.collectionAuthorityRecord
      ? ([input.collectionAuthorityRecord, false] as const)
      : ([programId, false] as const)
  );

  addAccountMeta(keys, signers, resolvedAccounts.metadata, false);
  addAccountMeta(keys, signers, resolvedAccounts.collectionAuthority, false);
  addAccountMeta(keys, signers, resolvedAccounts.collectionMint, false);
  addAccountMeta(keys, signers, resolvedAccounts.collection, false);
  addAccountMeta(
    keys,
    signers,
    resolvedAccounts.collectionMasterEditionAccount,
    false
  );
  addAccountMeta(
    keys,
    signers,
    resolvedAccounts.collectionAuthorityRecord,
    false
  );

  // Data.
  const data = getUnverifyCollectionInstructionDataSerializer().serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}