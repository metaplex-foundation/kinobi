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
  getProgramAddressWithFallback,
  mapSerializer,
} from '@lorisleiva/js-core';

// Accounts.
export type RevokeUseAuthorityInstructionAccounts = {
  /** Use Authority Record PDA */
  useAuthorityRecord: PublicKey;
  /** Owner */
  owner: Signer;
  /** A Use Authority */
  user: PublicKey;
  /** Owned Token Account Of Mint */
  ownerTokenAccount: PublicKey;
  /** Mint of Metadata */
  mint: PublicKey;
  /** Metadata account */
  metadata: PublicKey;
  /** Token program */
  tokenProgram?: PublicKey;
  /** System program */
  systemProgram?: PublicKey;
  /** Rent info */
  rent?: PublicKey;
};

// Discriminator.
export type RevokeUseAuthorityInstructionDiscriminator = number;
export function getRevokeUseAuthorityInstructionDiscriminator(): RevokeUseAuthorityInstructionDiscriminator {
  return 21;
}

// Data.
type RevokeUseAuthorityInstructionData = {
  discriminator: RevokeUseAuthorityInstructionDiscriminator;
};
export function getRevokeUseAuthorityInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<{}> {
  const s = context.serializer;
  const discriminator = getRevokeUseAuthorityInstructionDiscriminator();
  const serializer: Serializer<RevokeUseAuthorityInstructionData> =
    s.struct<RevokeUseAuthorityInstructionData>(
      [['discriminator', s.u8]],
      'RevokeUseAuthorityInstructionData'
    );
  return mapSerializer(serializer, () => ({ discriminator }));
}

// Instruction.
export function revokeUseAuthority(
  context: {
    serializer: Context['serializer'];
    eddsa: Context['eddsa'];
    programs?: Context['programs'];
  },
  input: RevokeUseAuthorityInstructionAccounts
): WrappedInstruction {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId: PublicKey = getProgramAddressWithFallback(
    context,
    'mplDigitalAsset',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );

  // Use Authority Record.
  keys.push({
    pubkey: input.useAuthorityRecord,
    isSigner: false,
    isWritable: false,
  });

  // Owner.
  signers.push(input.owner);
  keys.push({
    pubkey: input.owner.publicKey,
    isSigner: true,
    isWritable: false,
  });

  // User.
  keys.push({ pubkey: input.user, isSigner: false, isWritable: false });

  // Owner Token Account.
  keys.push({
    pubkey: input.ownerTokenAccount,
    isSigner: false,
    isWritable: false,
  });

  // Mint.
  keys.push({ pubkey: input.mint, isSigner: false, isWritable: false });

  // Metadata.
  keys.push({ pubkey: input.metadata, isSigner: false, isWritable: false });

  // Token Program.
  keys.push({
    pubkey:
      input.tokenProgram ??
      getProgramAddressWithFallback(
        context,
        'splToken',
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
      ),
    isSigner: false,
    isWritable: false,
  });

  // System Program.
  keys.push({
    pubkey:
      input.systemProgram ??
      getProgramAddressWithFallback(
        context,
        'splSystem',
        '11111111111111111111111111111111'
      ),
    isSigner: false,
    isWritable: false,
  });

  // Rent (optional).
  if (input.rent) {
    keys.push({ pubkey: input.rent, isSigner: false, isWritable: false });
  }

  // Data.
  const data = getRevokeUseAuthorityInstructionDataSerializer(
    context
  ).serialize({});

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain: 0,
  };
}
