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
import { UpdateArgs, UpdateArgsArgs, getUpdateArgsSerializer } from '../types';

// Accounts.
export type UpdateDigitalAssetInstructionAccounts = {
  /** Update authority or delegate */
  authority: Signer;
  /** Metadata account */
  metadata: PublicKey;
  /** Master Edition account */
  masterEdition?: PublicKey;
  /** Mint account */
  mint: PublicKey;
  /** System program */
  systemProgram?: PublicKey;
  /** System program */
  sysvarInstructions?: PublicKey;
  /** Token account */
  token?: PublicKey;
  /** Delegate record PDA */
  delegateRecord?: PublicKey;
  /** Token Authorization Rules Program */
  authorizationRulesProgram?: PublicKey;
  /** Token Authorization Rules account */
  authorizationRules?: PublicKey;
};

// Arguments.
export type UpdateDigitalAssetInstructionData = { updateArgs: UpdateArgs };
export type UpdateDigitalAssetInstructionArgs = { updateArgs: UpdateArgsArgs };

// Discriminator.
export type UpdateDigitalAssetInstructionDiscriminator = number;
export function getUpdateDigitalAssetInstructionDiscriminator(): UpdateDigitalAssetInstructionDiscriminator {
  return 43;
}

// Data.
type UpdateDigitalAssetInstructionData = UpdateDigitalAssetInstructionArgs & {
  discriminator: UpdateDigitalAssetInstructionDiscriminator;
};
export function getUpdateDigitalAssetInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<UpdateDigitalAssetInstructionArgs> {
  const s = context.serializer;
  const discriminator = getUpdateDigitalAssetInstructionDiscriminator();
  const serializer: Serializer<UpdateDigitalAssetInstructionData> =
    s.struct<UpdateDigitalAssetInstructionData>(
      [
        ['discriminator', s.u8],
        ['updateArgs', getUpdateArgsSerializer(context)],
      ],
      'UpdateDigitalAssetInstructionData'
    );
  return mapSerializer(
    serializer,
    (value: UpdateDigitalAssetInstructionArgs) => ({ ...value, discriminator })
  );
}

// Instruction.
export function updateDigitalAsset(
  context: {
    serializer: Context['serializer'];
    eddsa: Context['eddsa'];
    programs?: Context['programs'];
  },
  input: UpdateDigitalAssetInstructionAccounts &
    UpdateDigitalAssetInstructionArgs
): WrappedInstruction {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId: PublicKey = getProgramAddressWithFallback(
    context,
    'mplDigitalAsset',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );

  // Authority.
  signers.push(input.authority);
  keys.push({
    pubkey: input.authority.publicKey,
    isSigner: true,
    isWritable: false,
  });

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

  // Token (optional).
  if (input.token) {
    keys.push({ pubkey: input.token, isSigner: false, isWritable: false });
  }

  // Delegate Record (optional).
  if (input.delegateRecord) {
    keys.push({
      pubkey: input.delegateRecord,
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
  const data =
    getUpdateDigitalAssetInstructionDataSerializer(context).serialize(input);

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain: 0,
  };
}
