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
export type RevokeCollectionAuthorityInstructionAccounts = {
  /** Collection Authority Record PDA */
  collectionAuthorityRecord: PublicKey | Pda;
  /** Delegated Collection Authority */
  delegateAuthority: PublicKey | Pda;
  /** Update Authority, or Delegated Authority, of Collection NFT */
  revokeAuthority: Signer;
  /** Metadata account */
  metadata: PublicKey | Pda;
  /** Mint of Metadata */
  mint: PublicKey | Pda;
};

// Data.
export type RevokeCollectionAuthorityInstructionData = {
  discriminator: number;
};

export type RevokeCollectionAuthorityInstructionDataArgs = {};

export function getRevokeCollectionAuthorityInstructionDataSerializer(
  _context: object = {}
): Serializer<
  RevokeCollectionAuthorityInstructionDataArgs,
  RevokeCollectionAuthorityInstructionData
> {
  return mapSerializer<
    RevokeCollectionAuthorityInstructionDataArgs,
    any,
    RevokeCollectionAuthorityInstructionData
  >(
    struct<RevokeCollectionAuthorityInstructionData>(
      [['discriminator', u8()]],
      { description: 'RevokeCollectionAuthorityInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 24 })
  ) as Serializer<
    RevokeCollectionAuthorityInstructionDataArgs,
    RevokeCollectionAuthorityInstructionData
  >;
}

// Instruction.
export function revokeCollectionAuthority(
  context: Pick<Context, 'serializer' | 'programs'>,
  input: RevokeCollectionAuthorityInstructionAccounts
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
    delegateAuthority: [input.delegateAuthority, true] as const,
    revokeAuthority: [input.revokeAuthority, true] as const,
    metadata: [input.metadata, false] as const,
    mint: [input.mint, false] as const,
  };

  addAccountMeta(
    keys,
    signers,
    resolvedAccounts.collectionAuthorityRecord,
    false
  );
  addAccountMeta(keys, signers, resolvedAccounts.delegateAuthority, false);
  addAccountMeta(keys, signers, resolvedAccounts.revokeAuthority, false);
  addAccountMeta(keys, signers, resolvedAccounts.metadata, false);
  addAccountMeta(keys, signers, resolvedAccounts.mint, false);

  // Data.
  const data = getRevokeCollectionAuthorityInstructionDataSerializer(
    context
  ).serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
