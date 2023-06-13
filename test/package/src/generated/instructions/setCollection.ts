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
  Serializer,
  Signer,
  TransactionBuilder,
  mapSerializer,
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { addObjectProperty } from '../shared';

// Accounts.
export type SetCollectionInstructionAccounts = {
  candyMachine: PublicKey | Pda;
  authority?: Signer;
  authorityPda: PublicKey | Pda;
  payer?: Signer;
  collectionMint: PublicKey | Pda;
  collectionMetadata: PublicKey | Pda;
  collectionAuthorityRecord: PublicKey | Pda;
  newCollectionUpdateAuthority: Signer;
  newCollectionMetadata: PublicKey | Pda;
  newCollectionMint: PublicKey | Pda;
  newCollectionMasterEdition: PublicKey | Pda;
  newCollectionAuthorityRecord: PublicKey | Pda;
  tokenMetadataProgram?: PublicKey | Pda;
  systemProgram?: PublicKey | Pda;
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
    any,
    SetCollectionInstructionData
  >(
    s.struct<SetCollectionInstructionData>(
      [['discriminator', s.array(s.u8(), { size: 8 })]],
      { description: 'SetCollectionInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [192, 254, 206, 76, 168, 182, 59, 223],
    })
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
  const programId = context.programs.getPublicKey(
    'mplCandyMachineCore',
    'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
  );

  // Resolved inputs.
  const resolvedAccounts = {
    candyMachine: [input.candyMachine, true] as const,
    authorityPda: [input.authorityPda, true] as const,
    collectionMint: [input.collectionMint, false] as const,
    collectionMetadata: [input.collectionMetadata, false] as const,
    collectionAuthorityRecord: [input.collectionAuthorityRecord, true] as const,
    newCollectionUpdateAuthority: [
      input.newCollectionUpdateAuthority,
      true,
    ] as const,
    newCollectionMetadata: [input.newCollectionMetadata, false] as const,
    newCollectionMint: [input.newCollectionMint, false] as const,
    newCollectionMasterEdition: [
      input.newCollectionMasterEdition,
      false,
    ] as const,
    newCollectionAuthorityRecord: [
      input.newCollectionAuthorityRecord,
      true,
    ] as const,
  };
  addObjectProperty(
    resolvedAccounts,
    'authority',
    input.authority
      ? ([input.authority, false] as const)
      : ([context.identity, false] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'payer',
    input.payer
      ? ([input.payer, false] as const)
      : ([context.payer, false] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'tokenMetadataProgram',
    input.tokenMetadataProgram
      ? ([input.tokenMetadataProgram, false] as const)
      : ([
          context.programs.getPublicKey(
            'mplTokenMetadata',
            'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
          ),
          false,
        ] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'systemProgram',
    input.systemProgram
      ? ([input.systemProgram, false] as const)
      : ([
          context.programs.getPublicKey(
            'splSystem',
            '11111111111111111111111111111111'
          ),
          false,
        ] as const)
  );

  // Candy Machine.
  keys.push({
    pubkey: publicKey(resolvedAccounts.candyMachine[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.candyMachine[1],
  });

  // Authority.
  signers.push(resolvedAccounts.authority[0]);
  keys.push({
    pubkey: resolvedAccounts.authority[0].publicKey,
    isSigner: true,
    isWritable: resolvedAccounts.authority[1],
  });

  // Authority Pda.
  keys.push({
    pubkey: publicKey(resolvedAccounts.authorityPda[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.authorityPda[1],
  });

  // Payer.
  signers.push(resolvedAccounts.payer[0]);
  keys.push({
    pubkey: resolvedAccounts.payer[0].publicKey,
    isSigner: true,
    isWritable: resolvedAccounts.payer[1],
  });

  // Collection Mint.
  keys.push({
    pubkey: publicKey(resolvedAccounts.collectionMint[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.collectionMint[1],
  });

  // Collection Metadata.
  keys.push({
    pubkey: publicKey(resolvedAccounts.collectionMetadata[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.collectionMetadata[1],
  });

  // Collection Authority Record.
  keys.push({
    pubkey: publicKey(resolvedAccounts.collectionAuthorityRecord[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.collectionAuthorityRecord[1],
  });

  // New Collection Update Authority.
  signers.push(resolvedAccounts.newCollectionUpdateAuthority[0]);
  keys.push({
    pubkey: resolvedAccounts.newCollectionUpdateAuthority[0].publicKey,
    isSigner: true,
    isWritable: resolvedAccounts.newCollectionUpdateAuthority[1],
  });

  // New Collection Metadata.
  keys.push({
    pubkey: publicKey(resolvedAccounts.newCollectionMetadata[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.newCollectionMetadata[1],
  });

  // New Collection Mint.
  keys.push({
    pubkey: publicKey(resolvedAccounts.newCollectionMint[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.newCollectionMint[1],
  });

  // New Collection Master Edition.
  keys.push({
    pubkey: publicKey(resolvedAccounts.newCollectionMasterEdition[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.newCollectionMasterEdition[1],
  });

  // New Collection Authority Record.
  keys.push({
    pubkey: publicKey(resolvedAccounts.newCollectionAuthorityRecord[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.newCollectionAuthorityRecord[1],
  });

  // Token Metadata Program.
  keys.push({
    pubkey: publicKey(resolvedAccounts.tokenMetadataProgram[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.tokenMetadataProgram[1],
  });

  // System Program.
  keys.push({
    pubkey: publicKey(resolvedAccounts.systemProgram[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.systemProgram[1],
  });

  // Data.
  const data = getSetCollectionInstructionDataSerializer(context).serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
