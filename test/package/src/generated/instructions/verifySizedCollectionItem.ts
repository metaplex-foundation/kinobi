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
  WrappedInstruction,
  checkForIsWritableOverride as isWritable,
  mapSerializer,
} from '@metaplex-foundation/umi-core';

// Accounts.
export type VerifySizedCollectionItemInstructionAccounts = {
  /** Metadata account */
  metadata: PublicKey;
  /** Collection Update authority */
  collectionAuthority: Signer;
  /** payer */
  payer?: Signer;
  /** Mint of the Collection */
  collectionMint: PublicKey;
  /** Metadata Account of the Collection */
  collection: PublicKey;
  /** MasterEdition2 Account of the Collection Token */
  collectionMasterEditionAccount: PublicKey;
  /** Collection Authority Record PDA */
  collectionAuthorityRecord?: PublicKey;
};

// Arguments.
export type VerifySizedCollectionItemInstructionData = {
  discriminator: number;
};

export type VerifySizedCollectionItemInstructionArgs = {};

export function getVerifySizedCollectionItemInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  VerifySizedCollectionItemInstructionArgs,
  VerifySizedCollectionItemInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    VerifySizedCollectionItemInstructionArgs,
    VerifySizedCollectionItemInstructionData,
    VerifySizedCollectionItemInstructionData
  >(
    s.struct<VerifySizedCollectionItemInstructionData>(
      [['discriminator', s.u8]],
      'VerifySizedCollectionItemInstructionArgs'
    ),
    (value) =>
      ({
        ...value,
        discriminator: 30,
      } as VerifySizedCollectionItemInstructionData)
  ) as Serializer<
    VerifySizedCollectionItemInstructionArgs,
    VerifySizedCollectionItemInstructionData
  >;
}

// Instruction.
export function verifySizedCollectionItem(
  context: Pick<Context, 'serializer' | 'programs' | 'payer'>,
  input: VerifySizedCollectionItemInstructionAccounts
): WrappedInstruction {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId: PublicKey =
    context.programs.get('mplTokenMetadata').publicKey;

  // Resolved accounts.
  const metadataAccount = input.metadata;
  const collectionAuthorityAccount = input.collectionAuthority;
  const payerAccount = input.payer ?? context.payer;
  const collectionMintAccount = input.collectionMint;
  const collectionAccount = input.collection;
  const collectionMasterEditionAccountAccount =
    input.collectionMasterEditionAccount;
  const collectionAuthorityRecordAccount = input.collectionAuthorityRecord;

  // Metadata.
  keys.push({
    pubkey: metadataAccount,
    isSigner: false,
    isWritable: isWritable(metadataAccount, true),
  });

  // Collection Authority.
  signers.push(collectionAuthorityAccount);
  keys.push({
    pubkey: collectionAuthorityAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(collectionAuthorityAccount, false),
  });

  // Payer.
  signers.push(payerAccount);
  keys.push({
    pubkey: payerAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(payerAccount, true),
  });

  // Collection Mint.
  keys.push({
    pubkey: collectionMintAccount,
    isSigner: false,
    isWritable: isWritable(collectionMintAccount, false),
  });

  // Collection.
  keys.push({
    pubkey: collectionAccount,
    isSigner: false,
    isWritable: isWritable(collectionAccount, true),
  });

  // Collection Master Edition Account.
  keys.push({
    pubkey: collectionMasterEditionAccountAccount,
    isSigner: false,
    isWritable: isWritable(collectionMasterEditionAccountAccount, false),
  });

  // Collection Authority Record (optional).
  if (collectionAuthorityRecordAccount) {
    keys.push({
      pubkey: collectionAuthorityRecordAccount,
      isSigner: false,
      isWritable: isWritable(collectionAuthorityRecordAccount, false),
    });
  }

  // Data.
  const data = getVerifySizedCollectionItemInstructionDataSerializer(
    context
  ).serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain,
  };
}
