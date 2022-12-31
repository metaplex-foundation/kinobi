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
import { BurnArgs, BurnArgsArgs, getBurnArgsSerializer } from '../types';

// Accounts.
export type BurnInstructionAccounts = {
  /** Metadata (pda of ['metadata', program id, mint id]) */
  metadata: PublicKey;
  /** Asset owner */
  owner: Signer;
  /** Mint of token asset */
  mint: PublicKey;
  /** Token account to close */
  tokenAccount: PublicKey;
  /** MasterEdition of the asset */
  masterEditionAccount: PublicKey;
  /** SPL Token Program */
  splTokenProgram?: PublicKey;
  /** Metadata of the Collection */
  collectionMetadata?: PublicKey;
  /** Token Authorization Rules account */
  authorizationRules?: PublicKey;
  /** Token Authorization Rules Program */
  authorizationRulesProgram?: PublicKey;
};

// Arguments.
export type BurnInstructionData = { burnArgs: BurnArgs };
export type BurnInstructionArgs = { burnArgs: BurnArgsArgs };

// Discriminator.
export type BurnInstructionDiscriminator = number;
export function getBurnInstructionDiscriminator(): BurnInstructionDiscriminator {
  return 44;
}

// Data.
type BurnInstructionData = BurnInstructionArgs & {
  discriminator: BurnInstructionDiscriminator;
};
export function getBurnInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<BurnInstructionArgs> {
  const s = context.serializer;
  const discriminator = getBurnInstructionDiscriminator();
  const serializer: Serializer<BurnInstructionData> =
    s.struct<BurnInstructionData>(
      [
        ['discriminator', s.u8],
        ['burnArgs', getBurnArgsSerializer(context)],
      ],
      'BurnInstructionData'
    );
  return mapSerializer(serializer, (value: BurnInstructionArgs) => ({
    ...value,
    discriminator,
  }));
}

// Instruction.
export function burn(
  context: {
    serializer: Context['serializer'];
    eddsa: Context['eddsa'];
    programs?: Context['programs'];
  },
  input: BurnInstructionAccounts & BurnInstructionArgs
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

  // Owner.
  signers.push(input.owner);
  keys.push({
    pubkey: input.owner.publicKey,
    isSigner: true,
    isWritable: false,
  });

  // Mint.
  keys.push({ pubkey: input.mint, isSigner: false, isWritable: false });

  // Token Account.
  keys.push({ pubkey: input.tokenAccount, isSigner: false, isWritable: false });

  // Master Edition Account.
  keys.push({
    pubkey: input.masterEditionAccount,
    isSigner: false,
    isWritable: false,
  });

  // Spl Token Program.
  keys.push({
    pubkey:
      input.splTokenProgram ??
      getProgramAddressWithFallback(
        context,
        'splToken',
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
      ),
    isSigner: false,
    isWritable: false,
  });

  // Collection Metadata (optional).
  if (input.collectionMetadata) {
    keys.push({
      pubkey: input.collectionMetadata,
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

  // Authorization Rules Program (optional).
  if (input.authorizationRulesProgram) {
    keys.push({
      pubkey: input.authorizationRulesProgram,
      isSigner: false,
      isWritable: false,
    });
  }

  // Data.
  const data = getBurnInstructionDataSerializer(context).serialize(input);

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain: 0,
  };
}
