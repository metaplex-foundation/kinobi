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
import { addAccountMeta, addObjectProperty } from '../shared';
import { AssetData, AssetDataArgs, getAssetDataSerializer } from '../types';

// Accounts.
export type CreateV1InstructionAccounts = {
  /** Metadata account key (pda of ['metadata', program id, mint id]) */
  metadata: PublicKey | Pda;
  /** Unallocated edition account with address as pda of ['metadata', program id, mint, 'edition'] */
  masterEdition?: PublicKey | Pda;
  /** Mint of token asset */
  mint: PublicKey | Pda;
  /** Mint authority */
  mintAuthority: Signer;
  /** Payer */
  payer?: Signer;
  /** update authority info */
  updateAuthority: PublicKey | Pda;
  /** System program */
  systemProgram?: PublicKey | Pda;
  /** Instructions sysvar account */
  sysvarInstructions?: PublicKey | Pda;
  /** SPL Token program */
  splTokenProgram?: PublicKey | Pda;
};

// Data.
export type CreateV1InstructionData = {
  discriminator: number;
  createV1Discriminator: number;
  assetData: AssetData;
  decimals: Option<number>;
  maxSupply: Option<bigint>;
};

export type CreateV1InstructionDataArgs = {
  assetData: AssetDataArgs;
  decimals: Option<number>;
  maxSupply: Option<number | bigint>;
};

export function getCreateV1InstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<CreateV1InstructionDataArgs, CreateV1InstructionData> {
  const s = context.serializer;
  return mapSerializer<
    CreateV1InstructionDataArgs,
    any,
    CreateV1InstructionData
  >(
    s.struct<CreateV1InstructionData>(
      [
        ['discriminator', s.u8()],
        ['createV1Discriminator', s.u8()],
        ['assetData', getAssetDataSerializer(context)],
        ['decimals', s.option(s.u8())],
        ['maxSupply', s.option(s.u64())],
      ],
      { description: 'CreateV1InstructionData' }
    ),
    (value) => ({ ...value, discriminator: 41, createV1Discriminator: 0 })
  ) as Serializer<CreateV1InstructionDataArgs, CreateV1InstructionData>;
}

// Args.
export type CreateV1InstructionArgs = CreateV1InstructionDataArgs;

// Instruction.
export function createV1(
  context: Pick<Context, 'serializer' | 'programs' | 'payer'>,
  input: CreateV1InstructionAccounts & CreateV1InstructionArgs
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
    mint: [input.mint, true] as const,
    mintAuthority: [input.mintAuthority, false] as const,
    updateAuthority: [input.updateAuthority, false] as const,
  };
  const resolvingArgs = {};
  addObjectProperty(
    resolvedAccounts,
    'masterEdition',
    input.masterEdition
      ? ([input.masterEdition, true] as const)
      : ([programId, false] as const)
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
  addObjectProperty(
    resolvedAccounts,
    'sysvarInstructions',
    input.sysvarInstructions
      ? ([input.sysvarInstructions, false] as const)
      : ([
          publicKey('Sysvar1nstructions1111111111111111111111111'),
          false,
        ] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'splTokenProgram',
    input.splTokenProgram
      ? ([input.splTokenProgram, false] as const)
      : ([
          context.programs.getPublicKey(
            'splToken',
            'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
          ),
          false,
        ] as const)
  );
  const resolvedArgs = { ...input, ...resolvingArgs };

  addAccountMeta(keys, signers, resolvedAccounts.metadata, false);
  addAccountMeta(keys, signers, resolvedAccounts.masterEdition, false);
  addAccountMeta(keys, signers, resolvedAccounts.mint, false);
  addAccountMeta(keys, signers, resolvedAccounts.mintAuthority, false);
  addAccountMeta(keys, signers, resolvedAccounts.payer, false);
  addAccountMeta(keys, signers, resolvedAccounts.updateAuthority, false);
  addAccountMeta(keys, signers, resolvedAccounts.systemProgram, false);
  addAccountMeta(keys, signers, resolvedAccounts.sysvarInstructions, false);
  addAccountMeta(keys, signers, resolvedAccounts.splTokenProgram, false);

  // Data.
  const data =
    getCreateV1InstructionDataSerializer(context).serialize(resolvedArgs);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
