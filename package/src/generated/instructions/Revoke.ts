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
import { RevokeArgs, getRevokeArgsSerializer } from '../types';

// Accounts.
export type RevokeInstructionAccounts = {
  /** Delegate account key (pda of [mint id, delegate role, user id, authority id]) */
  delegateRecord: PublicKey;
  /** Owner of the delegated account */
  delegate: PublicKey;
  /** Metadata account */
  metadata: PublicKey;
  /** Master Edition account */
  masterEdition?: PublicKey;
  /** Mint of metadata */
  mint: PublicKey;
  /** Owned Token Account of mint */
  token?: PublicKey;
  /** Authority to approve the delegation */
  authority: Signer;
  /** Payer */
  payer: Signer;
  /** System Program */
  systemProgram?: PublicKey;
  /** Instructions sysvar account */
  sysvarInstructions?: PublicKey;
  /** SPL Token Program */
  splTokenProgram?: PublicKey;
  /** Token Authorization Rules Program */
  authorizationRulesProgram?: PublicKey;
  /** Token Authorization Rules account */
  authorizationRules?: PublicKey;
};

// Arguments.
export type RevokeInstructionArgs = { revokeArgs: RevokeArgs };

// Discriminator.
export type RevokeInstructionDiscriminator = number;
export function getRevokeInstructionDiscriminator(): RevokeInstructionDiscriminator {
  return 49;
}

// Data.
type RevokeInstructionData = RevokeInstructionArgs & {
  discriminator: RevokeInstructionDiscriminator;
};
export function getRevokeInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<RevokeInstructionArgs> {
  const s = context.serializer;
  const discriminator = getRevokeInstructionDiscriminator();
  const serializer: Serializer<RevokeInstructionData> =
    s.struct<RevokeInstructionData>(
      [
        ['discriminator', s.u8],
        ['revokeArgs', getRevokeArgsSerializer(context)],
      ],
      'RevokeInstructionData'
    );
  return mapSerializer(serializer, (value: RevokeInstructionArgs) => ({
    ...value,
    discriminator,
  }));
}

// Instruction.
export function revoke(
  context: {
    serializer: Context['serializer'];
    eddsa: Context['eddsa'];
    programs?: Context['programs'];
  },
  input: RevokeInstructionAccounts & RevokeInstructionArgs
): WrappedInstruction {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId: PublicKey = getProgramAddressWithFallback(
    context,
    'mplDigitalAsset',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );

  // Delegate Record.
  keys.push({
    pubkey: input.delegateRecord,
    isSigner: false,
    isWritable: false,
  });

  // Delegate.
  keys.push({ pubkey: input.delegate, isSigner: false, isWritable: false });

  // Metadata.
  keys.push({ pubkey: input.metadata, isSigner: false, isWritable: false });

  // Master Edition (optional).
  if (input.masterEdition) {
    keys.push({
      pubkey: input.masterEdition,
      isSigner: false,
      isWritable: false,
    });
  }

  // Mint.
  keys.push({ pubkey: input.mint, isSigner: false, isWritable: false });

  // Token (optional).
  if (input.token) {
    keys.push({ pubkey: input.token, isSigner: false, isWritable: false });
  }

  // Authority.
  signers.push(input.authority);
  keys.push({
    pubkey: input.authority.publicKey,
    isSigner: true,
    isWritable: false,
  });

  // Payer.
  signers.push(input.payer);
  keys.push({
    pubkey: input.payer.publicKey,
    isSigner: true,
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

  // Spl Token Program (optional).
  if (input.splTokenProgram) {
    keys.push({
      pubkey: input.splTokenProgram,
      isSigner: false,
      isWritable: false,
    });
  }

  // Authorization Rules Program (optional).
  if (input.authorizationRulesProgram) {
    keys.push({
      pubkey: input.authorizationRulesProgram,
      isSigner: false,
      isWritable: false,
    });
  }

  // Authorization Rules (optional).
  if (input.authorizationRules) {
    keys.push({
      pubkey: input.authorizationRules,
      isSigner: false,
      isWritable: false,
    });
  }

  // Data.
  const data = getRevokeInstructionDataSerializer(context).serialize(input);

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain: 0,
  };
}
