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
import {
  TmCreateArgs,
  TmCreateArgsArgs,
  getTmCreateArgsSerializer,
} from '../types';

// Accounts.
export type CreateDigitalAssetInstructionAccounts = {
  /** Metadata account key (pda of ['metadata', program id, mint id]) */
  metadata: PublicKey;
  /** Unallocated edition account with address as pda of ['metadata', program id, mint, 'edition'] */
  masterEdition?: PublicKey;
  /** Mint of token asset */
  mint: PublicKey;
  /** Mint authority */
  mintAuthority: Signer;
  /** Payer */
  payer?: Signer;
  /** update authority info */
  updateAuthority: PublicKey;
  /** System program */
  systemProgram?: PublicKey;
  /** Instructions sysvar account */
  sysvarInstructions?: PublicKey;
  /** SPL Token program */
  splTokenProgram?: PublicKey;
};

// Arguments.
export type CreateDigitalAssetInstructionData = {
  discriminator: number;
  createArgs: TmCreateArgs;
};

export type CreateDigitalAssetInstructionArgs = {
  createArgs: TmCreateArgsArgs;
};

export function getCreateDigitalAssetInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  CreateDigitalAssetInstructionArgs,
  CreateDigitalAssetInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    CreateDigitalAssetInstructionArgs,
    CreateDigitalAssetInstructionData,
    CreateDigitalAssetInstructionData
  >(
    s.struct<CreateDigitalAssetInstructionData>(
      [
        ['discriminator', s.u8],
        ['createArgs', getTmCreateArgsSerializer(context)],
      ],
      'CreateInstructionArgs'
    ),
    (value) =>
      ({ discriminator: 41, ...value } as CreateDigitalAssetInstructionData)
  ) as Serializer<
    CreateDigitalAssetInstructionArgs,
    CreateDigitalAssetInstructionData
  >;
}

// Instruction.
export function createDigitalAsset(
  context: {
    serializer: Context['serializer'];
    payer: Context['payer'];
    programs?: Context['programs'];
  },
  input: CreateDigitalAssetInstructionAccounts &
    CreateDigitalAssetInstructionArgs
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
  const metadataAccount = input.metadata;
  const masterEditionAccount = input.masterEdition;
  const mintAccount = input.mint;
  const mintAuthorityAccount = input.mintAuthority;
  const payerAccount = input.payer ?? context.payer;
  const updateAuthorityAccount = input.updateAuthority;
  const systemProgramAccount = input.systemProgram ?? {
    ...getProgramAddressWithFallback(
      context,
      'splSystem',
      '11111111111111111111111111111111'
    ),
    isWritable: false,
  };
  const sysvarInstructionsAccount =
    input.sysvarInstructions ??
    publicKey('Sysvar1nstructions1111111111111111111111111');
  const splTokenProgramAccount = input.splTokenProgram ?? {
    ...getProgramAddressWithFallback(
      context,
      'splToken',
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    ),
    isWritable: false,
  };

  // Metadata.
  keys.push({
    pubkey: metadataAccount,
    isSigner: false,
    isWritable: isWritable(metadataAccount, true),
  });

  // Master Edition (optional).
  if (masterEditionAccount) {
    keys.push({
      pubkey: masterEditionAccount,
      isSigner: false,
      isWritable: isWritable(masterEditionAccount, true),
    });
  }

  // Mint.
  keys.push({
    pubkey: mintAccount,
    isSigner: false,
    isWritable: isWritable(mintAccount, true),
  });

  // Mint Authority.
  signers.push(mintAuthorityAccount);
  keys.push({
    pubkey: mintAuthorityAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(mintAuthorityAccount, false),
  });

  // Payer.
  signers.push(payerAccount);
  keys.push({
    pubkey: payerAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(payerAccount, true),
  });

  // Update Authority.
  keys.push({
    pubkey: updateAuthorityAccount,
    isSigner: false,
    isWritable: isWritable(updateAuthorityAccount, false),
  });

  // System Program.
  keys.push({
    pubkey: systemProgramAccount,
    isSigner: false,
    isWritable: isWritable(systemProgramAccount, false),
  });

  // Sysvar Instructions.
  keys.push({
    pubkey: sysvarInstructionsAccount,
    isSigner: false,
    isWritable: isWritable(sysvarInstructionsAccount, false),
  });

  // Spl Token Program.
  keys.push({
    pubkey: splTokenProgramAccount,
    isSigner: false,
    isWritable: isWritable(splTokenProgramAccount, false),
  });

  // Data.
  const data =
    getCreateDigitalAssetInstructionDataSerializer(context).serialize(input);

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain: 0,
  };
}
