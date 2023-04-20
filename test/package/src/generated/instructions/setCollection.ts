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
export type SetCollectionInstructionAccounts = {
  candyMachine: PublicKey;
  authority?: Signer;
  authorityPda: PublicKey;
  payer?: Signer;
  collectionMint: PublicKey;
  collectionMetadata: PublicKey;
  collectionAuthorityRecord: PublicKey;
  newCollectionUpdateAuthority: Signer;
  newCollectionMetadata: PublicKey;
  newCollectionMint: PublicKey;
  newCollectionMasterEdition: PublicKey;
  newCollectionAuthorityRecord: PublicKey;
  tokenMetadataProgram?: PublicKey;
  systemProgram?: PublicKey;
};

// Data.
export type SetCollectionInstructionData = { discriminator: Array<number> };

export type SetCollectionInstructionDataArgs = {};

export function getSetCollectionInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<SetCollectionInstructionDataArgs, SetCollectionInstructionData> {
  const s = context.serializer;
  return mapSerializer<
    SetCollectionInstructionDataArgs,
    SetCollectionInstructionData,
    SetCollectionInstructionData
  >(
    s.struct<SetCollectionInstructionData>(
      [['discriminator', s.array(s.u8(), { size: 8 })]],
      { description: 'SetCollectionInstructionData' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: [192, 254, 206, 76, 168, 182, 59, 223],
      } as SetCollectionInstructionData)
  ) as Serializer<
    SetCollectionInstructionDataArgs,
    SetCollectionInstructionData
  >;
}

// Instruction.
export function setCollection(
  context: Pick<Context, 'serializer' | 'programs' | 'identity' | 'payer'>,
  input: SetCollectionInstructionAccounts
): TransactionBuilder {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = {
    ...context.programs.getPublicKey(
      'mplCandyMachineCore',
      'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
    ),
    isWritable: false,
  };

  // Resolved inputs.
  const resolvedAccounts: any = { ...input };
  resolvedAccounts.authority = resolvedAccounts.authority ?? context.identity;
  resolvedAccounts.payer = resolvedAccounts.payer ?? context.payer;
  resolvedAccounts.tokenMetadataProgram =
    resolvedAccounts.tokenMetadataProgram ?? {
      ...context.programs.getPublicKey(
        'mplTokenMetadata',
        'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
      ),
      isWritable: false,
    };
  resolvedAccounts.systemProgram = resolvedAccounts.systemProgram ?? {
    ...context.programs.getPublicKey(
      'splSystem',
      '11111111111111111111111111111111'
    ),
    isWritable: false,
  };

  // Candy Machine.
  keys.push({
    pubkey: resolvedAccounts.candyMachine,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.candyMachine, true),
  });

  // Authority.
  signers.push(resolvedAccounts.authority);
  keys.push({
    pubkey: resolvedAccounts.authority.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.authority, false),
  });

  // Authority Pda.
  keys.push({
    pubkey: resolvedAccounts.authorityPda,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.authorityPda, true),
  });

  // Payer.
  signers.push(resolvedAccounts.payer);
  keys.push({
    pubkey: resolvedAccounts.payer.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.payer, false),
  });

  // Collection Mint.
  keys.push({
    pubkey: resolvedAccounts.collectionMint,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.collectionMint, false),
  });

  // Collection Metadata.
  keys.push({
    pubkey: resolvedAccounts.collectionMetadata,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.collectionMetadata, false),
  });

  // Collection Authority Record.
  keys.push({
    pubkey: resolvedAccounts.collectionAuthorityRecord,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.collectionAuthorityRecord, true),
  });

  // New Collection Update Authority.
  signers.push(resolvedAccounts.newCollectionUpdateAuthority);
  keys.push({
    pubkey: resolvedAccounts.newCollectionUpdateAuthority.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.newCollectionUpdateAuthority, true),
  });

  // New Collection Metadata.
  keys.push({
    pubkey: resolvedAccounts.newCollectionMetadata,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.newCollectionMetadata, false),
  });

  // New Collection Mint.
  keys.push({
    pubkey: resolvedAccounts.newCollectionMint,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.newCollectionMint, false),
  });

  // New Collection Master Edition.
  keys.push({
    pubkey: resolvedAccounts.newCollectionMasterEdition,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.newCollectionMasterEdition, false),
  });

  // New Collection Authority Record.
  keys.push({
    pubkey: resolvedAccounts.newCollectionAuthorityRecord,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.newCollectionAuthorityRecord, true),
  });

  // Token Metadata Program.
  keys.push({
    pubkey: resolvedAccounts.tokenMetadataProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.tokenMetadataProgram, false),
  });

  // System Program.
  keys.push({
    pubkey: resolvedAccounts.systemProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.systemProgram, false),
  });

  // Data.
  const data = getSetCollectionInstructionDataSerializer(context).serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
