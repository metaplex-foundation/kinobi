/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  ACCOUNT_HEADER_SIZE,
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
} from '@metaplex-foundation/umi/serializers';
import { getMasterEditionV2Size } from '../accounts';
import { addAccountMeta, addObjectProperty } from '../shared';
import {
  CreateMasterEditionArgs,
  CreateMasterEditionArgsArgs,
  getCreateMasterEditionArgsSerializer,
} from '../types';

// Accounts.
export type CreateMasterEditionV3InstructionAccounts = {
  /** Unallocated edition V2 account with address as pda of ['metadata', program id, mint, 'edition'] */
  edition: PublicKey | Pda;
  /** Metadata mint */
  mint: PublicKey | Pda;
  /** Update authority */
  updateAuthority: Signer;
  /** Mint authority on the metadata's mint - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY */
  mintAuthority: Signer;
  /** payer */
  payer?: Signer;
  /** Metadata account */
  metadata: PublicKey | Pda;
  /** Token program */
  tokenProgram?: PublicKey | Pda;
  /** System program */
  systemProgram?: PublicKey | Pda;
  /** Rent info */
  rent?: PublicKey | Pda;
};

// Data.
export type CreateMasterEditionV3InstructionData = {
  discriminator: number;
  createMasterEditionArgs: CreateMasterEditionArgs;
};

export type CreateMasterEditionV3InstructionDataArgs = {
  createMasterEditionArgs: CreateMasterEditionArgsArgs;
};

export function getCreateMasterEditionV3InstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  CreateMasterEditionV3InstructionDataArgs,
  CreateMasterEditionV3InstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    CreateMasterEditionV3InstructionDataArgs,
    any,
    CreateMasterEditionV3InstructionData
  >(
    s.struct<CreateMasterEditionV3InstructionData>(
      [
        ['discriminator', s.u8()],
        [
          'createMasterEditionArgs',
          getCreateMasterEditionArgsSerializer(context),
        ],
      ],
      { description: 'CreateMasterEditionV3InstructionData' }
    ),
    (value) => ({ ...value, discriminator: 17 })
  ) as Serializer<
    CreateMasterEditionV3InstructionDataArgs,
    CreateMasterEditionV3InstructionData
  >;
}

// Args.
export type CreateMasterEditionV3InstructionArgs =
  CreateMasterEditionV3InstructionDataArgs;

// Instruction.
export function createMasterEditionV3(
  context: Pick<Context, 'serializer' | 'programs' | 'payer'>,
  input: CreateMasterEditionV3InstructionAccounts &
    CreateMasterEditionV3InstructionArgs
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
    edition: [input.edition, true] as const,
    mint: [input.mint, true] as const,
    updateAuthority: [input.updateAuthority, false] as const,
    mintAuthority: [input.mintAuthority, false] as const,
    metadata: [input.metadata, true] as const,
    rent: [input.rent, false] as const,
  };
  const resolvingArgs = {};
  addObjectProperty(
    resolvedAccounts,
    'payer',
    input.payer
      ? ([input.payer, true] as const)
      : ([context.payer, true] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'tokenProgram',
    input.tokenProgram
      ? ([input.tokenProgram, false] as const)
      : ([
          context.programs.getPublicKey(
            'splToken',
            'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
          ),
          false,
        ] as const)
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

  addAccountMeta(keys, signers, resolvedAccounts.edition, false);
  addAccountMeta(keys, signers, resolvedAccounts.mint, false);
  addAccountMeta(keys, signers, resolvedAccounts.updateAuthority, false);
  addAccountMeta(keys, signers, resolvedAccounts.mintAuthority, false);
  addAccountMeta(keys, signers, resolvedAccounts.payer, false);
  addAccountMeta(keys, signers, resolvedAccounts.metadata, false);
  addAccountMeta(keys, signers, resolvedAccounts.tokenProgram, false);
  addAccountMeta(keys, signers, resolvedAccounts.systemProgram, false);
  addAccountMeta(keys, signers, resolvedAccounts.rent, true);

  // Data.
  const data =
    getCreateMasterEditionV3InstructionDataSerializer(context).serialize(
      resolvedArgs
    );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = getMasterEditionV2Size() + ACCOUNT_HEADER_SIZE;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
