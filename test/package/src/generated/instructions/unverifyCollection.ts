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
  PublicKey,
  Serializer,
  Signer,
  TransactionBuilder,
  checkForIsWritableOverride as isWritable,
  mapSerializer,
  transactionBuilder,
} from '@metaplex-foundation/umi';

// Accounts.
export type UnverifyCollectionInstructionAccounts = {
  /** Metadata account */
  metadata: PublicKey;
  /** Collection Authority */
  collectionAuthority: Signer;
  /** Mint of the Collection */
  collectionMint: PublicKey;
  /** Metadata Account of the Collection */
  collection: PublicKey;
  /** MasterEdition2 Account of the Collection Token */
  collectionMasterEditionAccount: PublicKey;
  /** Collection Authority Record PDA */
  collectionAuthorityRecord?: PublicKey;
};

// Data.
export type UnverifyCollectionInstructionData = { discriminator: number };

export type UnverifyCollectionInstructionDataArgs = {};

export function getUnverifyCollectionInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  UnverifyCollectionInstructionDataArgs,
  UnverifyCollectionInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    UnverifyCollectionInstructionDataArgs,
    UnverifyCollectionInstructionData,
    UnverifyCollectionInstructionData
  >(
    s.struct<UnverifyCollectionInstructionData>([['discriminator', s.u8()]], {
      description: 'UnverifyCollectionInstructionData',
    }),
    (value) =>
      ({ ...value, discriminator: 22 } as UnverifyCollectionInstructionData)
  ) as Serializer<
    UnverifyCollectionInstructionDataArgs,
    UnverifyCollectionInstructionData
  >;
}

// Instruction.
export function unverifyCollection(
  context: Pick<Context, 'serializer' | 'programs'>,
  input: UnverifyCollectionInstructionAccounts
): TransactionBuilder {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = {
    ...context.programs.getPublicKey(
      'mplTokenMetadata',
      'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
    ),
    isWritable: false,
  };

  // Resolved inputs.
  const resolvedAccounts: any = { ...input };

  // Metadata.
  keys.push({
    pubkey: resolvedAccounts.metadata,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.metadata, true),
  });

  // Collection Authority.
  signers.push(resolvedAccounts.collectionAuthority);
  keys.push({
    pubkey: resolvedAccounts.collectionAuthority.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.collectionAuthority, true),
  });

  // Collection Mint.
  keys.push({
    pubkey: resolvedAccounts.collectionMint,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.collectionMint, false),
  });

  // Collection.
  keys.push({
    pubkey: resolvedAccounts.collection,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.collection, false),
  });

  // Collection Master Edition Account.
  keys.push({
    pubkey: resolvedAccounts.collectionMasterEditionAccount,
    isSigner: false,
    isWritable: isWritable(
      resolvedAccounts.collectionMasterEditionAccount,
      false
    ),
  });

  // Collection Authority Record (optional).
  if (resolvedAccounts.collectionAuthorityRecord) {
    keys.push({
      pubkey: resolvedAccounts.collectionAuthorityRecord,
      isSigner: false,
      isWritable: isWritable(resolvedAccounts.collectionAuthorityRecord, false),
    });
  }

  // Data.
  const data = getUnverifyCollectionInstructionDataSerializer(
    context
  ).serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
