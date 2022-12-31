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
import {
  CollectionDetails,
  DataV2,
  getCollectionDetailsSerializer,
  getDataV2Serializer,
} from '../types';

// Accounts.
export type CreateMetadataAccountV3InstructionAccounts = {
  /** Metadata key (pda of ['metadata', program id, mint id]) */
  metadata: PublicKey;
  /** Mint of token asset */
  mint: PublicKey;
  /** Mint authority */
  mintAuthority: Signer;
  /** payer */
  payer: Signer;
  /** update authority info */
  updateAuthority: PublicKey;
  /** System program */
  systemProgram?: PublicKey;
  /** Rent info */
  rent?: PublicKey;
};

// Arguments.
export type CreateMetadataAccountV3InstructionArgs = {
  data: DataV2;
  isMutable: boolean;
  collectionDetails: Option<CollectionDetails>;
};

// Discriminator.
export type CreateMetadataAccountV3InstructionDiscriminator = number;
export function getCreateMetadataAccountV3InstructionDiscriminator(): CreateMetadataAccountV3InstructionDiscriminator {
  return 33;
}

// Data.
type CreateMetadataAccountV3InstructionData =
  CreateMetadataAccountV3InstructionArgs & {
    discriminator: CreateMetadataAccountV3InstructionDiscriminator;
  };
export function getCreateMetadataAccountV3InstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<CreateMetadataAccountV3InstructionArgs> {
  const s = context.serializer;
  const discriminator = getCreateMetadataAccountV3InstructionDiscriminator();
  const serializer: Serializer<CreateMetadataAccountV3InstructionData> =
    s.struct<CreateMetadataAccountV3InstructionData>(
      [
        ['discriminator', s.u8],
        ['data', getDataV2Serializer(context)],
        ['isMutable', s.bool],
        [
          'collectionDetails',
          s.option(getCollectionDetailsSerializer(context)),
        ],
      ],
      'CreateMetadataAccountV3InstructionData'
    );
  return mapSerializer(
    serializer,
    (value: CreateMetadataAccountV3InstructionArgs) => ({
      ...value,
      discriminator,
    })
  );
}

// Instruction.
export function createMetadataAccountV3(
  context: {
    serializer: Context['serializer'];
    eddsa: Context['eddsa'];
    programs?: Context['programs'];
  },
  input: CreateMetadataAccountV3InstructionAccounts &
    CreateMetadataAccountV3InstructionArgs
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

  // Mint.
  keys.push({ pubkey: input.mint, isSigner: false, isWritable: false });

  // Mint Authority.
  signers.push(input.mintAuthority);
  keys.push({
    pubkey: input.mintAuthority.publicKey,
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

  // Update Authority.
  keys.push({
    pubkey: input.updateAuthority,
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
    getCreateMetadataAccountV3InstructionDataSerializer(context).serialize(
      input
    );

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain: 0,
  };
}
