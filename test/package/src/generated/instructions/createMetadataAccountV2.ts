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
  mapSerializer,
} from '@metaplex-foundation/umi-core';
import { DataV2, DataV2Args, getDataV2Serializer } from '../types';

// Accounts.
export type CreateMetadataAccountV2InstructionAccounts = {
  /** Metadata key (pda of ['metadata', program id, mint id]) */
  metadata: PublicKey;
  /** Mint of token asset */
  mint: PublicKey;
  /** Mint authority */
  mintAuthority: Signer;
  /** payer */
  payer?: Signer;
  /** update authority info */
  updateAuthority: PublicKey;
  /** System program */
  systemProgram?: PublicKey;
  /** Rent info */
  rent?: PublicKey;
};

// Arguments.
export type CreateMetadataAccountV2InstructionData = {
  discriminator: number;
  data: DataV2;
  isMutable: boolean;
};

export type CreateMetadataAccountV2InstructionDataArgs = {
  data: DataV2Args;
  isMutable: boolean;
};

export function getCreateMetadataAccountV2InstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  CreateMetadataAccountV2InstructionDataArgs,
  CreateMetadataAccountV2InstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    CreateMetadataAccountV2InstructionDataArgs,
    CreateMetadataAccountV2InstructionData,
    CreateMetadataAccountV2InstructionData
  >(
    s.struct<CreateMetadataAccountV2InstructionData>(
      [
        ['discriminator', s.u8()],
        ['data', getDataV2Serializer(context)],
        ['isMutable', s.bool()],
      ],
      { description: 'CreateMetadataAccountV2InstructionData' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: 16,
      } as CreateMetadataAccountV2InstructionData)
  ) as Serializer<
    CreateMetadataAccountV2InstructionDataArgs,
    CreateMetadataAccountV2InstructionData
  >;
}

// Instruction.
export function createMetadataAccountV2(
  context: Pick<Context, 'serializer' | 'programs' | 'payer'>,
  input: CreateMetadataAccountV2InstructionAccounts &
    CreateMetadataAccountV2InstructionDataArgs
): WrappedInstruction {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId: PublicKey =
    context.programs.get('mplTokenMetadata').publicKey;

  // Resolved accounts.
  const metadataAccount = input.metadata;
  const mintAccount = input.mint;
  const mintAuthorityAccount = input.mintAuthority;
  const payerAccount = input.payer ?? context.payer;
  const updateAuthorityAccount = input.updateAuthority;
  const systemProgramAccount = input.systemProgram ?? {
    ...context.programs.get('splSystem').publicKey,
    isWritable: false,
  };
  const rentAccount = input.rent;

  // Metadata.
  keys.push({
    pubkey: metadataAccount,
    isSigner: false,
    isWritable: isWritable(metadataAccount, true),
  });

  // Mint.
  keys.push({
    pubkey: mintAccount,
    isSigner: false,
    isWritable: isWritable(mintAccount, false),
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

  // Rent (optional).
  if (rentAccount) {
    keys.push({
      pubkey: rentAccount,
      isSigner: false,
      isWritable: isWritable(rentAccount, false),
    });
  }

  // Data.
  const data =
    getCreateMetadataAccountV2InstructionDataSerializer(context).serialize(
      input
    );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain,
  };
}
