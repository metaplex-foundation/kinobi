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
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  mapSerializer,
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import { addAccountMeta } from '../shared';

// Accounts.
export type PuffMetadataInstructionAccounts = {
  /** Metadata account */
  metadata: PublicKey | Pda;
};

// Data.
export type PuffMetadataInstructionData = { discriminator: number };

export type PuffMetadataInstructionDataArgs = {};

export function getPuffMetadataInstructionDataSerializer(
  _context: object = {}
): Serializer<PuffMetadataInstructionDataArgs, PuffMetadataInstructionData> {
  return mapSerializer<
    PuffMetadataInstructionDataArgs,
    any,
    PuffMetadataInstructionData
  >(
    struct<PuffMetadataInstructionData>([['discriminator', u8()]], {
      description: 'PuffMetadataInstructionData',
    }),
    (value) => ({ ...value, discriminator: 14 })
  ) as Serializer<PuffMetadataInstructionDataArgs, PuffMetadataInstructionData>;
}

// Instruction.
export function puffMetadata(
  context: Pick<Context, 'serializer' | 'programs'>,
  input: PuffMetadataInstructionAccounts
): TransactionBuilder {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplTokenMetadata',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );

  // Resolved inputs.
  const resolvedAccounts = {
    metadata: [input.metadata, true] as const,
  };

  addAccountMeta(keys, signers, resolvedAccounts.metadata, false);

  // Data.
  const data = getPuffMetadataInstructionDataSerializer(context).serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
