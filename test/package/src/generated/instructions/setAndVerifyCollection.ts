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
  mapSerializer,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { isWritable } from '../shared';

// Accounts.
export type SetAndVerifyCollectionInstructionAccounts = {
  /** Metadata account */
  metadata: PublicKey;
  /** Collection Update authority */
  collectionAuthority: Signer;
  /** Payer */
  payer?: Signer;
  /** Update Authority of Collection NFT and NFT */
  updateAuthority: PublicKey;
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
export type SetAndVerifyCollectionInstructionData = { discriminator: number };

export type SetAndVerifyCollectionInstructionDataArgs = {};

export function getSetAndVerifyCollectionInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  SetAndVerifyCollectionInstructionDataArgs,
  SetAndVerifyCollectionInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    SetAndVerifyCollectionInstructionDataArgs,
    SetAndVerifyCollectionInstructionData,
    SetAndVerifyCollectionInstructionData
  >(
    s.struct<SetAndVerifyCollectionInstructionData>(
      [['discriminator', s.u8()]],
      { description: 'SetAndVerifyCollectionInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 25 } as SetAndVerifyCollectionInstructionData)
  ) as Serializer<
    SetAndVerifyCollectionInstructionDataArgs,
    SetAndVerifyCollectionInstructionData
  >;
}

// Instruction.
export function setAndVerifyCollection(
  context: Pick<Context, 'serializer' | 'programs' | 'payer'>,
  input: SetAndVerifyCollectionInstructionAccounts
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
  resolvedAccounts.payer = resolvedAccounts.payer ?? context.payer;

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

  // Payer.
  signers.push(resolvedAccounts.payer);
  keys.push({
    pubkey: resolvedAccounts.payer.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.payer, true),
  });

  // Update Authority.
  keys.push({
    pubkey: resolvedAccounts.updateAuthority,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.updateAuthority, false),
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
  const data = getSetAndVerifyCollectionInstructionDataSerializer(
    context
  ).serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
