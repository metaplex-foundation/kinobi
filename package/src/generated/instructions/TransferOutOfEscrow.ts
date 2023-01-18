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
  getProgramAddressWithFallback,
  mapSerializer,
  publicKey,
} from '@lorisleiva/js-core';

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

// Arguments.
export type TransferOutOfEscrowInstructionData = {
  discriminator: number;
  amount: bigint;
};

export type TransferOutOfEscrowInstructionArgs = { amount: number | bigint };

export function getTransferOutOfEscrowInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  TransferOutOfEscrowInstructionArgs,
  TransferOutOfEscrowInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    TransferOutOfEscrowInstructionArgs,
    TransferOutOfEscrowInstructionData,
    TransferOutOfEscrowInstructionData
  >(
    s.struct<TransferOutOfEscrowInstructionData>(
      [
        ['discriminator', s.u8],
        ['amount', s.u64],
      ],
      'TransferOutOfEscrowInstructionArgs'
    ),
    (value) =>
      ({ discriminator: 40, ...value } as TransferOutOfEscrowInstructionData)
  ) as Serializer<
    TransferOutOfEscrowInstructionArgs,
    TransferOutOfEscrowInstructionData
  >;
}

// Instruction.
export function transferOutOfEscrow(
  context: {
    serializer: Context['serializer'];
    payer: Context['payer'];
    programs?: Context['programs'];
  },
  input: TransferOutOfEscrowInstructionAccounts &
    TransferOutOfEscrowInstructionArgs
): WrappedInstruction {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId: PublicKey = getProgramAddressWithFallback(
    context,
    'mplTokenMetadata',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );

  // Resolved accounts.
  const escrowAccount = input.escrow;
  const metadataAccount = input.metadata;
  const payerAccount = input.payer ?? context.payer;
  const attributeMintAccount = input.attributeMint;
  const attributeSrcAccount = input.attributeSrc;
  const attributeDstAccount = input.attributeDst;
  const escrowMintAccount = input.escrowMint;
  const escrowAccountAccount = input.escrowAccount;
  const systemProgramAccount = input.systemProgram ?? {
    ...getProgramAddressWithFallback(
      context,
      'splSystem',
      '11111111111111111111111111111111'
    ),
    isWritable: false,
  };
  const ataProgramAccount = input.ataProgram ?? {
    ...getProgramAddressWithFallback(
      context,
      'splAssociatedToken',
      'TokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
    ),
    isWritable: false,
  };
  const tokenProgramAccount = input.tokenProgram ?? {
    ...getProgramAddressWithFallback(
      context,
      'splToken',
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    ),
    isWritable: false,
  };
  const sysvarInstructionsAccount =
    input.sysvarInstructions ??
    publicKey('Sysvar1nstructions1111111111111111111111111');
  const authorityAccount = input.authority;

  // Escrow.
  keys.push({
    pubkey: escrowAccount,
    isSigner: false,
    isWritable: isWritable(escrowAccount, false),
  });

  // Metadata.
  keys.push({
    pubkey: metadataAccount,
    isSigner: false,
    isWritable: isWritable(metadataAccount, true),
  });

  // Payer.
  signers.push(payerAccount);
  keys.push({
    pubkey: payerAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(payerAccount, true),
  });

  // Attribute Mint.
  keys.push({
    pubkey: attributeMintAccount,
    isSigner: false,
    isWritable: isWritable(attributeMintAccount, false),
  });

  // Attribute Src.
  keys.push({
    pubkey: attributeSrcAccount,
    isSigner: false,
    isWritable: isWritable(attributeSrcAccount, true),
  });

  // Attribute Dst.
  keys.push({
    pubkey: attributeDstAccount,
    isSigner: false,
    isWritable: isWritable(attributeDstAccount, true),
  });

  // Escrow Mint.
  keys.push({
    pubkey: escrowMintAccount,
    isSigner: false,
    isWritable: isWritable(escrowMintAccount, false),
  });

  // Escrow Account.
  keys.push({
    pubkey: escrowAccountAccount,
    isSigner: false,
    isWritable: isWritable(escrowAccountAccount, false),
  });

  // System Program.
  keys.push({
    pubkey: systemProgramAccount,
    isSigner: false,
    isWritable: isWritable(systemProgramAccount, false),
  });

  // Ata Program.
  keys.push({
    pubkey: ataProgramAccount,
    isSigner: false,
    isWritable: isWritable(ataProgramAccount, false),
  });

  // Token Program.
  keys.push({
    pubkey: tokenProgramAccount,
    isSigner: false,
    isWritable: isWritable(tokenProgramAccount, false),
  });

  // Sysvar Instructions.
  keys.push({
    pubkey: sysvarInstructionsAccount,
    isSigner: false,
    isWritable: isWritable(sysvarInstructionsAccount, false),
  });

  // Authority (optional).
  if (authorityAccount) {
    signers.push(authorityAccount);
    keys.push({
      pubkey: authorityAccount.publicKey,
      isSigner: true,
      isWritable: isWritable(authorityAccount, false),
    });
  }

  // Data.
  const data =
    getTransferOutOfEscrowInstructionDataSerializer(context).serialize(input);

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain: 0,
  };
}
