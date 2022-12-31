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
export type UtilizeInstructionAccounts = {
  /** Metadata account */
  metadata: PublicKey;
  /** Token Account Of NFT */
  tokenAccount: PublicKey;
  /** Mint of the Metadata */
  mint: PublicKey;
  /** A Use Authority / Can be the current Owner of the NFT */
  useAuthority: Signer;
  /** Owner */
  owner: PublicKey;
  /** Token program */
  tokenProgram?: PublicKey;
  /** Associated Token program */
  ataProgram?: PublicKey;
  /** System program */
  systemProgram?: PublicKey;
  /** Rent info */
  rent?: PublicKey;
  /** Use Authority Record PDA If present the program Assumes a delegated use authority */
  useAuthorityRecord?: PublicKey;
  /** Program As Signer (Burner) */
  burner?: PublicKey;
};

// Arguments.
export type UtilizeInstructionArgs = { numberOfUses: bigint };

// Discriminator.
export type UtilizeInstructionDiscriminator = number;
export function getUtilizeInstructionDiscriminator(): UtilizeInstructionDiscriminator {
  return 19;
}

// Data.
type UtilizeInstructionData = UtilizeInstructionArgs & {
  discriminator: UtilizeInstructionDiscriminator;
};
export function getUtilizeInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<UtilizeInstructionArgs> {
  const s = context.serializer;
  const discriminator = getUtilizeInstructionDiscriminator();
  const serializer: Serializer<UtilizeInstructionData> =
    s.struct<UtilizeInstructionData>(
      [
        ['discriminator', s.u8],
        ['numberOfUses', s.u64],
      ],
      'UtilizeInstructionData'
    );
  return mapSerializer(serializer, (value: UtilizeInstructionArgs) => ({
    ...value,
    discriminator,
  }));
}

// Instruction.
export function utilize(
  context: {
    serializer: Context['serializer'];
    eddsa: Context['eddsa'];
    programs?: Context['programs'];
  },
  input: UtilizeInstructionAccounts & UtilizeInstructionArgs
): WrappedInstruction {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId: PublicKey = getProgramAddressWithFallback(
    context,
    'mplDigitalAsset',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );

  // Metadata.
  keys.push({ pubkey: input.metadata, isSigner: false, isWritable: false });

  // Token Account.
  keys.push({ pubkey: input.tokenAccount, isSigner: false, isWritable: false });

  // Mint.
  keys.push({ pubkey: input.mint, isSigner: false, isWritable: false });

  // Use Authority.
  signers.push(input.useAuthority);
  keys.push({
    pubkey: input.useAuthority.publicKey,
    isSigner: true,
    isWritable: false,
  });

  // Owner.
  keys.push({ pubkey: input.owner, isSigner: false, isWritable: false });

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

  // Ata Program.
  keys.push({
    pubkey:
      input.ataProgram ??
      getProgramAddressWithFallback(
        context,
        'splAssociatedToken',
        'TokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
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

  // Rent.
  keys.push({
    pubkey:
      input.rent ??
      context.eddsa.createPublicKey(
        'SysvarRent111111111111111111111111111111111'
      ),
    isSigner: false,
    isWritable: false,
  });

  // Use Authority Record (optional).
  if (input.useAuthorityRecord) {
    keys.push({
      pubkey: input.useAuthorityRecord,
      isSigner: false,
      isWritable: false,
    });
  }

  // Burner (optional).
  if (input.burner) {
    keys.push({ pubkey: input.burner, isSigner: false, isWritable: false });
  }

  // Data.
  const data = getUtilizeInstructionDataSerializer(context).serialize(input);

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain: 0,
  };
}
