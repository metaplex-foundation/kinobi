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
  Option,
  PublicKey,
  Serializer,
  Signer,
  WrappedInstruction,
  getProgramAddressWithFallback,
  mapSerializer,
} from '@lorisleiva/js-core';
import { DataV2, DataV2Args, getDataV2Serializer } from '../types';

// Accounts.
export type UpdateMetadataAccountV2InstructionAccounts = {
  /** Metadata account */
  metadata: PublicKey;
  /** Update authority key */
  updateAuthority: Signer;
};

// Arguments.
export type UpdateMetadataAccountV2InstructionData = {
  discriminator: number;
  data: Option<DataV2>;
  updateAuthority: Option<PublicKey>;
  primarySaleHappened: Option<boolean>;
  isMutable: Option<boolean>;
};

export type UpdateMetadataAccountV2InstructionArgs = {
  data: Option<DataV2Args>;
  updateAuthority: Option<PublicKey>;
  primarySaleHappened: Option<boolean>;
  isMutable: Option<boolean>;
};

export function getUpdateMetadataAccountV2InstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  UpdateMetadataAccountV2InstructionArgs,
  UpdateMetadataAccountV2InstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    UpdateMetadataAccountV2InstructionArgs,
    UpdateMetadataAccountV2InstructionData,
    UpdateMetadataAccountV2InstructionData
  >(
    s.struct<UpdateMetadataAccountV2InstructionData>(
      [
        ['discriminator', s.u8],
        ['data', s.option(getDataV2Serializer(context))],
        ['updateAuthority', s.option(s.publicKey)],
        ['primarySaleHappened', s.option(s.bool)],
        ['isMutable', s.option(s.bool)],
      ],
      'UpdateMetadataAccountV2InstructionArgs'
    ),
    (value) =>
      ({
        discriminator: 15,
        ...value,
      } as UpdateMetadataAccountV2InstructionData)
  ) as Serializer<
    UpdateMetadataAccountV2InstructionArgs,
    UpdateMetadataAccountV2InstructionData
  >;
}

// Instruction.
export function updateMetadataAccountV2(
  context: {
    serializer: Context['serializer'];
    eddsa: Context['eddsa'];
    programs?: Context['programs'];
  },
  accounts: UpdateMetadataAccountV2InstructionAccounts,
  args: UpdateMetadataAccountV2InstructionArgs
): WrappedInstruction {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId: PublicKey = getProgramAddressWithFallback(
    context,
    'mplTokenMetadata',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );

  // Metadata.
  keys.push({ pubkey: accounts.metadata, isSigner: false, isWritable: true });

  // Update Authority.
  signers.push(accounts.updateAuthority);
  keys.push({
    pubkey: accounts.updateAuthority.publicKey,
    isSigner: true,
    isWritable: false,
  });

  // Data.
  const data =
    getUpdateMetadataAccountV2InstructionDataSerializer(context).serialize(
      args
    );

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain: 0,
  };
}
