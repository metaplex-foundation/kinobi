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
export type ApproveCollectionAuthorityInstructionAccounts = {
  /** Collection Authority Record PDA */
  collectionAuthorityRecord: PublicKey;
  /** A Collection Authority */
  newCollectionAuthority: PublicKey;
  /** Update Authority of Collection NFT */
  updateAuthority: Signer;
  /** Payer */
  payer?: Signer;
  /** Collection Metadata account */
  metadata: PublicKey;
  /** Mint of Collection Metadata */
  mint: PublicKey;
  /** System program */
  systemProgram?: PublicKey;
  /** Rent info */
  rent?: PublicKey;
};

// Data.
export type ApproveCollectionAuthorityInstructionData = {
  discriminator: number;
};

export type ApproveCollectionAuthorityInstructionDataArgs = {};

export function getApproveCollectionAuthorityInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  ApproveCollectionAuthorityInstructionDataArgs,
  ApproveCollectionAuthorityInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    ApproveCollectionAuthorityInstructionDataArgs,
    ApproveCollectionAuthorityInstructionData,
    ApproveCollectionAuthorityInstructionData
  >(
    s.struct<ApproveCollectionAuthorityInstructionData>(
      [['discriminator', s.u8()]],
      { description: 'ApproveCollectionAuthorityInstructionData' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: 23,
      } as ApproveCollectionAuthorityInstructionData)
  ) as Serializer<
    ApproveCollectionAuthorityInstructionDataArgs,
    ApproveCollectionAuthorityInstructionData
  >;
}

// Instruction.
export function approveCollectionAuthority(
  context: Pick<Context, 'serializer' | 'programs' | 'payer'>,
  input: ApproveCollectionAuthorityInstructionAccounts
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
  const resolvedArgs: any = { ...input };
  resolvedAccounts.payer = resolvedAccounts.payer ?? context.payer;
  resolvedAccounts.systemProgram = resolvedAccounts.systemProgram ?? {
    ...context.programs.getPublicKey(
      'splSystem',
      '11111111111111111111111111111111'
    ),
    isWritable: false,
  };

  // Collection Authority Record.
  keys.push({
    pubkey: resolvedAccounts.collectionAuthorityRecord,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.collectionAuthorityRecord, true),
  });

  // New Collection Authority.
  keys.push({
    pubkey: resolvedAccounts.newCollectionAuthority,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.newCollectionAuthority, false),
  });

  // Update Authority.
  signers.push(resolvedAccounts.updateAuthority);
  keys.push({
    pubkey: resolvedAccounts.updateAuthority.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.updateAuthority, true),
  });

  // Payer.
  signers.push(resolvedAccounts.payer);
  keys.push({
    pubkey: resolvedAccounts.payer.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.payer, true),
  });

  // Metadata.
  keys.push({
    pubkey: resolvedAccounts.metadata,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.metadata, false),
  });

  // Mint.
  keys.push({
    pubkey: resolvedAccounts.mint,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.mint, false),
  });

  // System Program.
  keys.push({
    pubkey: resolvedAccounts.systemProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.systemProgram, false),
  });

  // Rent (optional).
  if (resolvedAccounts.rent) {
    keys.push({
      pubkey: resolvedAccounts.rent,
      isSigner: false,
      isWritable: isWritable(resolvedAccounts.rent, false),
    });
  }

  // Data.
  const data = getApproveCollectionAuthorityInstructionDataSerializer(
    context
  ).serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
