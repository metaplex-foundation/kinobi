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
import {
  MigrateArgs,
  MigrateArgsArgs,
  getMigrateArgsSerializer,
} from '../types';

// Accounts.
export type MigrateInstructionAccounts = {
  /** Metadata account */
  metadata: PublicKey;
  /** Master edition account */
  masterEdition: PublicKey;
  /** Token account */
  tokenAccount: PublicKey;
  /** Mint account */
  mint: PublicKey;
  /** Update authority */
  updateAuthority: Signer;
  /** Collection metadata account */
  collectionMetadata: PublicKey;
  /** Token Program */
  tokenProgram?: PublicKey;
  /** System program */
  systemProgram?: PublicKey;
  /** Instruction sysvar account */
  sysvarInstructions?: PublicKey;
  /** Token Authorization Rules account */
  authorizationRules?: PublicKey;
};

// Arguments.
export type MigrateInstructionData = { migrateArgs: MigrateArgs };
export type MigrateInstructionArgs = { migrateArgs: MigrateArgsArgs };

// Discriminator.
export type MigrateInstructionDiscriminator = number;
export function getMigrateInstructionDiscriminator(): MigrateInstructionDiscriminator {
  return 50;
}

// Data.
type MigrateInstructionData = MigrateInstructionArgs & {
  discriminator: MigrateInstructionDiscriminator;
};
export function getMigrateInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<MigrateInstructionArgs> {
  const s = context.serializer;
  const discriminator = getMigrateInstructionDiscriminator();
  const serializer: Serializer<MigrateInstructionData> =
    s.struct<MigrateInstructionData>(
      [
        ['discriminator', s.u8],
        ['migrateArgs', getMigrateArgsSerializer(context)],
      ],
      'MigrateInstructionData'
    );
  return mapSerializer(serializer, (value: MigrateInstructionArgs) => ({
    ...value,
    discriminator,
  }));
}

// Instruction.
export function migrate(
  context: {
    serializer: Context['serializer'];
    eddsa: Context['eddsa'];
    programs?: Context['programs'];
  },
  input: MigrateInstructionAccounts & MigrateInstructionArgs
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

  // Master Edition.
  keys.push({
    pubkey: input.masterEdition,
    isSigner: false,
    isWritable: false,
  });

  // Token Account.
  keys.push({ pubkey: input.tokenAccount, isSigner: false, isWritable: false });

  // Mint.
  keys.push({ pubkey: input.mint, isSigner: false, isWritable: false });

  // Update Authority.
  signers.push(input.updateAuthority);
  keys.push({
    pubkey: input.updateAuthority.publicKey,
    isSigner: true,
    isWritable: false,
  });

  // Collection Metadata.
  keys.push({
    pubkey: input.collectionMetadata,
    isSigner: false,
    isWritable: false,
  });

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

  // Sysvar Instructions.
  keys.push({
    pubkey:
      input.sysvarInstructions ??
      context.eddsa.createPublicKey(
        'Sysvar1nstructions1111111111111111111111111'
      ),
    isSigner: false,
    isWritable: false,
  });

  // Authorization Rules (optional).
  if (input.authorizationRules) {
    keys.push({
      pubkey: input.authorizationRules,
      isSigner: false,
      isWritable: false,
    });
  }

  // Data.
  const data = getMigrateInstructionDataSerializer(context).serialize(input);

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain: 0,
  };
}
