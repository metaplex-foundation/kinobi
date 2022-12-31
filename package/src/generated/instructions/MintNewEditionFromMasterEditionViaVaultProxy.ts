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
  MintNewEditionFromMasterEditionViaTokenArgs,
  MintNewEditionFromMasterEditionViaTokenArgsArgs,
  getMintNewEditionFromMasterEditionViaTokenArgsSerializer,
} from '../types';

// Accounts.
export type MintNewEditionFromMasterEditionViaVaultProxyInstructionAccounts = {
  /** New Metadata key (pda of ['metadata', program id, mint id]) */
  newMetadata: PublicKey;
  /** New Edition (pda of ['metadata', program id, mint id, 'edition']) */
  newEdition: PublicKey;
  /** Master Record Edition V2 (pda of ['metadata', program id, master metadata mint id, 'edition'] */
  masterEdition: PublicKey;
  /** Mint of new token - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY */
  newMint: PublicKey;
  /** Edition pda to mark creation - will be checked for pre-existence. (pda of ['metadata', program id, master metadata mint id, 'edition', edition_number]) where edition_number is NOT the edition number you pass in args but actually edition_number = floor(edition/EDITION_MARKER_BIT_SIZE). */
  editionMarkPda: PublicKey;
  /** Mint authority of new mint */
  newMintAuthority: Signer;
  /** payer */
  payer: Signer;
  /** Vault authority */
  vaultAuthority: Signer;
  /** Safety deposit token store account */
  safetyDepositStore: PublicKey;
  /** Safety deposit box */
  safetyDepositBox: PublicKey;
  /** Vault */
  vault: PublicKey;
  /** Update authority info for new metadata */
  newMetadataUpdateAuthority: PublicKey;
  /** Master record metadata account */
  metadata: PublicKey;
  /** Token program */
  tokenProgram?: PublicKey;
  /** Token vault program */
  tokenVaultProgram: PublicKey;
  /** System program */
  systemProgram?: PublicKey;
  /** Rent info */
  rent?: PublicKey;
};

// Arguments.
export type MintNewEditionFromMasterEditionViaVaultProxyInstructionData = {
  mintNewEditionFromMasterEditionViaTokenArgs: MintNewEditionFromMasterEditionViaTokenArgs;
};
export type MintNewEditionFromMasterEditionViaVaultProxyInstructionArgs = {
  mintNewEditionFromMasterEditionViaTokenArgs: MintNewEditionFromMasterEditionViaTokenArgsArgs;
};

// Discriminator.
export type MintNewEditionFromMasterEditionViaVaultProxyInstructionDiscriminator =
  number;
export function getMintNewEditionFromMasterEditionViaVaultProxyInstructionDiscriminator(): MintNewEditionFromMasterEditionViaVaultProxyInstructionDiscriminator {
  return 13;
}

// Data.
type MintNewEditionFromMasterEditionViaVaultProxyInstructionData =
  MintNewEditionFromMasterEditionViaVaultProxyInstructionArgs & {
    discriminator: MintNewEditionFromMasterEditionViaVaultProxyInstructionDiscriminator;
  };
export function getMintNewEditionFromMasterEditionViaVaultProxyInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<MintNewEditionFromMasterEditionViaVaultProxyInstructionArgs> {
  const s = context.serializer;
  const discriminator =
    getMintNewEditionFromMasterEditionViaVaultProxyInstructionDiscriminator();
  const serializer: Serializer<MintNewEditionFromMasterEditionViaVaultProxyInstructionData> =
    s.struct<MintNewEditionFromMasterEditionViaVaultProxyInstructionData>(
      [
        ['discriminator', s.u8],
        [
          'mintNewEditionFromMasterEditionViaTokenArgs',
          getMintNewEditionFromMasterEditionViaTokenArgsSerializer(context),
        ],
      ],
      'MintNewEditionFromMasterEditionViaVaultProxyInstructionData'
    );
  return mapSerializer(
    serializer,
    (value: MintNewEditionFromMasterEditionViaVaultProxyInstructionArgs) => ({
      ...value,
      discriminator,
    })
  );
}

// Instruction.
export function mintNewEditionFromMasterEditionViaVaultProxy(
  context: {
    serializer: Context['serializer'];
    eddsa: Context['eddsa'];
    programs?: Context['programs'];
  },
  input: MintNewEditionFromMasterEditionViaVaultProxyInstructionAccounts &
    MintNewEditionFromMasterEditionViaVaultProxyInstructionArgs
): WrappedInstruction {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId: PublicKey = getProgramAddressWithFallback(
    context,
    'mplDigitalAsset',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );

  // New Metadata.
  keys.push({ pubkey: input.newMetadata, isSigner: false, isWritable: false });

  // New Edition.
  keys.push({ pubkey: input.newEdition, isSigner: false, isWritable: false });

  // Master Edition.
  keys.push({
    pubkey: input.masterEdition,
    isSigner: false,
    isWritable: false,
  });

  // New Mint.
  keys.push({ pubkey: input.newMint, isSigner: false, isWritable: false });

  // Edition Mark Pda.
  keys.push({
    pubkey: input.editionMarkPda,
    isSigner: false,
    isWritable: false,
  });

  // New Mint Authority.
  signers.push(input.newMintAuthority);
  keys.push({
    pubkey: input.newMintAuthority.publicKey,
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

  // Vault Authority.
  signers.push(input.vaultAuthority);
  keys.push({
    pubkey: input.vaultAuthority.publicKey,
    isSigner: true,
    isWritable: false,
  });

  // Safety Deposit Store.
  keys.push({
    pubkey: input.safetyDepositStore,
    isSigner: false,
    isWritable: false,
  });

  // Safety Deposit Box.
  keys.push({
    pubkey: input.safetyDepositBox,
    isSigner: false,
    isWritable: false,
  });

  // Vault.
  keys.push({ pubkey: input.vault, isSigner: false, isWritable: false });

  // New Metadata Update Authority.
  keys.push({
    pubkey: input.newMetadataUpdateAuthority,
    isSigner: false,
    isWritable: false,
  });

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

  // Token Vault Program.
  keys.push({
    pubkey: input.tokenVaultProgram,
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
  const data =
    getMintNewEditionFromMasterEditionViaVaultProxyInstructionDataSerializer(
      context
    ).serialize(input);

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain: 0,
  };
}
