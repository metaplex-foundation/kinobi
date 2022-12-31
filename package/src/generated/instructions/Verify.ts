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
import { VerifyArgs, getVerifyArgsSerializer } from '../types';

// Accounts.
export type VerifyInstructionAccounts = {
  /** Metadata account */
  metadata: PublicKey;
  /** Collection Update authority */
  collectionAuthority: Signer;
  /** payer */
  payer: Signer;
  /** Token Authorization Rules account */
  authorizationRules?: PublicKey;
  /** Token Authorization Rules Program */
  authorizationRulesProgram?: PublicKey;
};

// Arguments.
export type VerifyInstructionArgs = { verifyArgs: VerifyArgs };

// Discriminator.
export type VerifyInstructionDiscriminator = number;
export function getVerifyInstructionDiscriminator(): VerifyInstructionDiscriminator {
  return 47;
}

// Data.
type VerifyInstructionData = VerifyInstructionArgs & {
  discriminator: VerifyInstructionDiscriminator;
};
export function getVerifyInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<VerifyInstructionArgs> {
  const s = context.serializer;
  const discriminator = getVerifyInstructionDiscriminator();
  const serializer: Serializer<VerifyInstructionData> =
    s.struct<VerifyInstructionData>(
      [
        ['discriminator', s.u8],
        ['verifyArgs', getVerifyArgsSerializer(context)],
      ],
      'VerifyInstructionData'
    );
  return mapSerializer(serializer, (value: VerifyInstructionArgs) => ({
    ...value,
    discriminator,
  }));
}

// Instruction.
export function verify(
  context: {
    serializer: Context['serializer'];
    eddsa: Context['eddsa'];
    programs?: Context['programs'];
  },
  input: VerifyInstructionAccounts & VerifyInstructionArgs
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

  // Collection Authority.
  signers.push(input.collectionAuthority);
  keys.push({
    pubkey: input.collectionAuthority.publicKey,
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

  // Authorization Rules (optional).
  if (input.authorizationRules) {
    keys.push({
      pubkey: input.authorizationRules,
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

  // Data.
  const data = getVerifyInstructionDataSerializer(context).serialize(input);

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain: 0,
  };
}
