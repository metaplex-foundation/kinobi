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
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';

// Accounts.
export type TransferOutOfEscrowInstructionAccounts = {
  /** Escrow account */
  escrow: PublicKey;
  /** Metadata account */
  metadata: PublicKey;
  /** Wallet paying for the transaction and new account */
  payer?: Signer;
  /** Mint account for the new attribute */
  attributeMint: PublicKey;
  /** Token account source for the new attribute */
  attributeSrc: PublicKey;
  /** Token account, owned by TM, destination for the new attribute */
  attributeDst: PublicKey;
  /** Mint account that the escrow is attached */
  escrowMint: PublicKey;
  /** Token account that holds the token the escrow is attached to */
  escrowAccount: PublicKey;
  /** System program */
  systemProgram?: PublicKey;
  /** Associated Token program */
  ataProgram?: PublicKey;
  /** Token program */
  tokenProgram?: PublicKey;
  /** Instructions sysvar account */
  sysvarInstructions?: PublicKey;
  /** Authority/creator of the escrow account */
  authority?: Signer;
};

// Data.
export type TransferOutOfEscrowInstructionData = {
  discriminator: number;
  amount: bigint;
};

export type TransferOutOfEscrowInstructionDataArgs = {
  amount: number | bigint;
};

export function getTransferOutOfEscrowInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  TransferOutOfEscrowInstructionDataArgs,
  TransferOutOfEscrowInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    TransferOutOfEscrowInstructionDataArgs,
    TransferOutOfEscrowInstructionData,
    TransferOutOfEscrowInstructionData
  >(
    s.struct<TransferOutOfEscrowInstructionData>(
      [
        ['discriminator', s.u8()],
        ['amount', s.u64()],
      ],
      { description: 'TransferOutOfEscrowInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 40 } as TransferOutOfEscrowInstructionData)
  ) as Serializer<
    TransferOutOfEscrowInstructionDataArgs,
    TransferOutOfEscrowInstructionData
  >;
}

// Args.
export type TransferOutOfEscrowInstructionArgs =
  TransferOutOfEscrowInstructionDataArgs;

// Instruction.
export function transferOutOfEscrow(
  context: Pick<Context, 'serializer' | 'programs' | 'payer'>,
  input: TransferOutOfEscrowInstructionAccounts &
    TransferOutOfEscrowInstructionArgs
): TransactionBuilder {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplTokenMetadata',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );

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
  resolvedAccounts.ataProgram = resolvedAccounts.ataProgram ?? {
    ...context.programs.getPublicKey(
      'splAssociatedToken',
      'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
    ),
    isWritable: false,
  };
  resolvedAccounts.tokenProgram = resolvedAccounts.tokenProgram ?? {
    ...context.programs.getPublicKey(
      'splToken',
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    ),
    isWritable: false,
  };
  resolvedAccounts.sysvarInstructions =
    resolvedAccounts.sysvarInstructions ??
    publicKey('Sysvar1nstructions1111111111111111111111111');

  // Escrow.
  keys.push({
    pubkey: resolvedAccounts.escrow,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.escrow, false),
  });

  // Metadata.
  keys.push({
    pubkey: resolvedAccounts.metadata,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.metadata, true),
  });

  // Payer.
  signers.push(resolvedAccounts.payer);
  keys.push({
    pubkey: resolvedAccounts.payer.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.payer, true),
  });

  // Attribute Mint.
  keys.push({
    pubkey: resolvedAccounts.attributeMint,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.attributeMint, false),
  });

  // Attribute Src.
  keys.push({
    pubkey: resolvedAccounts.attributeSrc,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.attributeSrc, true),
  });

  // Attribute Dst.
  keys.push({
    pubkey: resolvedAccounts.attributeDst,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.attributeDst, true),
  });

  // Escrow Mint.
  keys.push({
    pubkey: resolvedAccounts.escrowMint,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.escrowMint, false),
  });

  // Escrow Account.
  keys.push({
    pubkey: resolvedAccounts.escrowAccount,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.escrowAccount, false),
  });

  // System Program.
  keys.push({
    pubkey: resolvedAccounts.systemProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.systemProgram, false),
  });

  // Ata Program.
  keys.push({
    pubkey: resolvedAccounts.ataProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.ataProgram, false),
  });

  // Token Program.
  keys.push({
    pubkey: resolvedAccounts.tokenProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.tokenProgram, false),
  });

  // Sysvar Instructions.
  keys.push({
    pubkey: resolvedAccounts.sysvarInstructions,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.sysvarInstructions, false),
  });

  // Authority (optional).
  if (resolvedAccounts.authority) {
    signers.push(resolvedAccounts.authority);
    keys.push({
      pubkey: resolvedAccounts.authority.publicKey,
      isSigner: true,
      isWritable: isWritable(resolvedAccounts.authority, false),
    });
  }

  // Data.
  const data =
    getTransferOutOfEscrowInstructionDataSerializer(context).serialize(
      resolvedArgs
    );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
