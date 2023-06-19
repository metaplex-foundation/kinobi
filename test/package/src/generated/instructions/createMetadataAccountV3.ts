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
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  mapSerializer,
} from '@metaplex-foundation/umi/serializers';
import { findMetadataPda } from '../accounts';
import { addAccountMeta, addObjectProperty } from '../shared';
import {
  CollectionDetails,
  CollectionDetailsArgs,
  DataV2,
  DataV2Args,
  getCollectionDetailsSerializer,
  getDataV2Serializer,
} from '../types';

// Accounts.
export type CreateMetadataAccountV3InstructionAccounts = {
  /** Metadata key (pda of ['metadata', program id, mint id]) */
  metadata?: PublicKey | Pda;
  /** Mint of token asset */
  mint: PublicKey | Pda;
  /** Mint authority */
  mintAuthority: Signer;
  /** payer */
  payer?: Signer;
  /** update authority info */
  updateAuthority: PublicKey | Pda;
  /** System program */
  systemProgram?: PublicKey | Pda;
  /** Rent info */
  rent?: PublicKey | Pda;
};

// Data.
export type CreateMetadataAccountV3InstructionData = {
  discriminator: number;
  data: DataV2;
  isMutable: boolean;
  collectionDetails: Option<CollectionDetails>;
};

export type CreateMetadataAccountV3InstructionDataArgs = {
  data: DataV2Args;
  isMutable: boolean;
  collectionDetails: Option<CollectionDetailsArgs>;
};

export function getCreateMetadataAccountV3InstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  CreateMetadataAccountV3InstructionDataArgs,
  CreateMetadataAccountV3InstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    CreateMetadataAccountV3InstructionDataArgs,
    any,
    CreateMetadataAccountV3InstructionData
  >(
    s.struct<CreateMetadataAccountV3InstructionData>(
      [
        ['discriminator', s.u8()],
        ['data', getDataV2Serializer(context)],
        ['isMutable', s.bool()],
        [
          'collectionDetails',
          s.option(getCollectionDetailsSerializer(context)),
        ],
      ],
      { description: 'CreateMetadataAccountV3InstructionData' }
    ),
    (value) => ({ ...value, discriminator: 33 })
  ) as Serializer<
    CreateMetadataAccountV3InstructionDataArgs,
    CreateMetadataAccountV3InstructionData
  >;
}

// Args.
export type CreateMetadataAccountV3InstructionArgs =
  CreateMetadataAccountV3InstructionDataArgs;

// Instruction.
export function createMetadataAccountV3(
  context: Pick<Context, 'serializer' | 'programs' | 'eddsa' | 'payer'>,
  input: CreateMetadataAccountV3InstructionAccounts &
    CreateMetadataAccountV3InstructionArgs
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
    mint: [input.mint, false] as const,
    mintAuthority: [input.mintAuthority, false] as const,
    updateAuthority: [input.updateAuthority, false] as const,
    rent: [input.rent, false] as const,
  };
  const resolvingArgs = {};
  addObjectProperty(
    resolvedAccounts,
    'metadata',
    input.metadata
      ? ([input.metadata, true] as const)
      : ([
          findMetadataPda(context, { mint: publicKey(input.mint, false) }),
          true,
        ] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'payer',
    input.payer
      ? ([input.payer, true] as const)
      : ([context.payer, true] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'systemProgram',
    input.systemProgram
      ? ([input.systemProgram, false] as const)
      : ([
          context.programs.getPublicKey(
            'splSystem',
            '11111111111111111111111111111111'
          ),
          false,
        ] as const)
  );
  const resolvedArgs = { ...input, ...resolvingArgs };

  addAccountMeta(keys, signers, resolvedAccounts.metadata, false);
  addAccountMeta(keys, signers, resolvedAccounts.mint, false);
  addAccountMeta(keys, signers, resolvedAccounts.mintAuthority, false);
  addAccountMeta(keys, signers, resolvedAccounts.payer, false);
  addAccountMeta(keys, signers, resolvedAccounts.updateAuthority, false);
  addAccountMeta(keys, signers, resolvedAccounts.systemProgram, false);
  addAccountMeta(keys, signers, resolvedAccounts.rent, true);

  // Data.
  const data =
    getCreateMetadataAccountV3InstructionDataSerializer(context).serialize(
      resolvedArgs
    );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
