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
import { addAccountMeta, addObjectProperty } from '../shared';

// Accounts.
export type ApproveCollectionAuthorityInstructionAccounts = {
  /** Collection Authority Record PDA */
  collectionAuthorityRecord: PublicKey | Pda;
  /** A Collection Authority */
  newCollectionAuthority: PublicKey | Pda;
  /** Update Authority of Collection NFT */
  updateAuthority: Signer;
  /** Payer */
  payer?: Signer;
  /** Collection Metadata account */
  metadata: PublicKey | Pda;
  /** Mint of Collection Metadata */
  mint: PublicKey | Pda;
  /** System program */
  systemProgram?: PublicKey | Pda;
  /** Rent info */
  rent?: PublicKey | Pda;
};

// Data.
export type ApproveCollectionAuthorityInstructionData = {
  discriminator: number;
};

export type ApproveCollectionAuthorityInstructionDataArgs = {};

export function getApproveCollectionAuthorityInstructionDataSerializer(
  _context: object = {}
): Serializer<
  ApproveCollectionAuthorityInstructionDataArgs,
  ApproveCollectionAuthorityInstructionData
> {
  return mapSerializer<
    ApproveCollectionAuthorityInstructionDataArgs,
    any,
    ApproveCollectionAuthorityInstructionData
  >(
    struct<ApproveCollectionAuthorityInstructionData>(
      [['discriminator', u8()]],
      { description: 'ApproveCollectionAuthorityInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 23 })
  ) as Serializer<
    ApproveCollectionAuthorityInstructionDataArgs,
    ApproveCollectionAuthorityInstructionData
  >;
}

// Instruction.
export function approveCollectionAuthority(
  context: Pick<Context, 'serializer' | 'programs' | 'payer'>,
  input: ApproveCollectionAuthorityInstructionAccounts
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
    collectionAuthorityRecord: [input.collectionAuthorityRecord, true] as const,
    newCollectionAuthority: [input.newCollectionAuthority, false] as const,
    updateAuthority: [input.updateAuthority, true] as const,
    metadata: [input.metadata, false] as const,
    mint: [input.mint, false] as const,
    rent: [input.rent, false] as const,
  };
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

  addAccountMeta(
    keys,
    signers,
    resolvedAccounts.collectionAuthorityRecord,
    false
  );
  addAccountMeta(keys, signers, resolvedAccounts.newCollectionAuthority, false);
  addAccountMeta(keys, signers, resolvedAccounts.updateAuthority, false);
  addAccountMeta(keys, signers, resolvedAccounts.payer, false);
  addAccountMeta(keys, signers, resolvedAccounts.metadata, false);
  addAccountMeta(keys, signers, resolvedAccounts.mint, false);
  addAccountMeta(keys, signers, resolvedAccounts.systemProgram, false);
  addAccountMeta(keys, signers, resolvedAccounts.rent, true);

  // Data.
  const data = getApproveCollectionAuthorityInstructionDataSerializer(
    context
  ).serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
