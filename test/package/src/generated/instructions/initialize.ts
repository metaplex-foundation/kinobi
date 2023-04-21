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
import {
  CandyMachineData,
  CandyMachineDataArgs,
  getCandyMachineDataSerializer,
} from '../types';

// Accounts.
export type InitializeInstructionAccounts = {
  candyMachine: PublicKey;
  authorityPda: PublicKey;
  authority?: PublicKey;
  payer?: Signer;
  collectionMetadata: PublicKey;
  collectionMint: PublicKey;
  collectionMasterEdition: PublicKey;
  collectionUpdateAuthority: Signer;
  collectionAuthorityRecord: PublicKey;
  tokenMetadataProgram?: PublicKey;
  systemProgram?: PublicKey;
};

// Data.
export type InitializeInstructionData = {
  discriminator: Array<number>;
  data: CandyMachineData;
};

export type InitializeInstructionDataArgs = { data: CandyMachineDataArgs };

export function getInitializeInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<InitializeInstructionDataArgs, InitializeInstructionData> {
  const s = context.serializer;
  return mapSerializer<
    InitializeInstructionDataArgs,
    InitializeInstructionData,
    InitializeInstructionData
  >(
    s.struct<InitializeInstructionData>(
      [
        ['discriminator', s.array(s.u8(), { size: 8 })],
        ['data', getCandyMachineDataSerializer(context)],
      ],
      { description: 'InitializeInstructionData' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      } as InitializeInstructionData)
  ) as Serializer<InitializeInstructionDataArgs, InitializeInstructionData>;
}

// Args.
export type InitializeInstructionArgs = InitializeInstructionDataArgs;

// Instruction.
export function initialize(
  context: Pick<Context, 'serializer' | 'programs' | 'identity' | 'payer'>,
  input: InitializeInstructionAccounts & InitializeInstructionArgs
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
  const resolvedArgs: any = { ...input };
  resolvedAccounts.authority =
    resolvedAccounts.authority ?? context.identity.publicKey;
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

  // Authority Pda.
  keys.push({
    pubkey: resolvedAccounts.authorityPda,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.authorityPda, true),
  });

  // Authority.
  keys.push({
    pubkey: resolvedAccounts.authority,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.authority, false),
  });

  // Payer.
  signers.push(resolvedAccounts.payer);
  keys.push({
    pubkey: resolvedAccounts.payer.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.payer, false),
  });

  // Collection Metadata.
  keys.push({
    pubkey: resolvedAccounts.collectionMetadata,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.collectionMetadata, false),
  });

  // Collection Mint.
  keys.push({
    pubkey: resolvedAccounts.collectionMint,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.collectionMint, false),
  });

  // Collection Master Edition.
  keys.push({
    pubkey: resolvedAccounts.collectionMasterEdition,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.collectionMasterEdition, false),
  });

  // Collection Update Authority.
  signers.push(resolvedAccounts.collectionUpdateAuthority);
  keys.push({
    pubkey: resolvedAccounts.collectionUpdateAuthority.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.collectionUpdateAuthority, true),
  });

  // Collection Authority Record.
  keys.push({
    pubkey: resolvedAccounts.collectionAuthorityRecord,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.collectionAuthorityRecord, true),
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
  const data =
    getInitializeInstructionDataSerializer(context).serialize(resolvedArgs);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
