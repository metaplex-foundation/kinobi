/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
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
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';
import {
  SetCollectionSizeArgs,
  SetCollectionSizeArgsArgs,
  getSetCollectionSizeArgsSerializer,
} from '../types';

// Accounts.
export type SetCollectionSizeInstructionAccounts = {
  /** Collection Metadata account */
  collectionMetadata: PublicKey | Pda;
  /** Collection Update authority */
  collectionAuthority: Signer;
  /** Mint of the Collection */
  collectionMint: PublicKey | Pda;
  /** Collection Authority Record PDA */
  collectionAuthorityRecord?: PublicKey | Pda;
};

// Data.
export type SetCollectionSizeInstructionData = {
  discriminator: number;
  setCollectionSizeArgs: SetCollectionSizeArgs;
};

export type SetCollectionSizeInstructionDataArgs = {
  setCollectionSizeArgs: SetCollectionSizeArgsArgs;
};

export function getSetCollectionSizeInstructionDataSerializer(): Serializer<
  SetCollectionSizeInstructionDataArgs,
  SetCollectionSizeInstructionData
> {
  return mapSerializer<
    SetCollectionSizeInstructionDataArgs,
    any,
    SetCollectionSizeInstructionData
  >(
    struct<SetCollectionSizeInstructionData>(
      [
        ['discriminator', u8()],
        ['setCollectionSizeArgs', getSetCollectionSizeArgsSerializer()],
      ],
      { description: 'SetCollectionSizeInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 34 })
  ) as Serializer<
    SetCollectionSizeInstructionDataArgs,
    SetCollectionSizeInstructionData
  >;
}

// Args.
export type SetCollectionSizeInstructionArgs =
  SetCollectionSizeInstructionDataArgs;

// Instruction.
export function setCollectionSize(
  context: Pick<Context, 'programs'>,
  input: SetCollectionSizeInstructionAccounts & SetCollectionSizeInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplTokenMetadata',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );

  // Accounts.
  const resolvedAccounts: ResolvedAccountsWithIndices = {
    collectionMetadata: {
      index: 0,
      isWritable: true,
      value: input.collectionMetadata ?? null,
    },
    collectionAuthority: {
      index: 1,
      isWritable: true,
      value: input.collectionAuthority ?? null,
    },
    collectionMint: {
      index: 2,
      isWritable: false,
      value: input.collectionMint ?? null,
    },
    collectionAuthorityRecord: {
      index: 3,
      isWritable: false,
      value: input.collectionAuthorityRecord ?? null,
    },
  };

  // Arguments.
  const resolvedArgs: SetCollectionSizeInstructionArgs = { ...input };

  // Accounts in order.
  const orderedAccounts: ResolvedAccount[] = Object.values(
    resolvedAccounts
  ).sort((a, b) => a.index - b.index);

  // Keys and Signers.
  const [keys, signers] = getAccountMetasAndSigners(
    orderedAccounts,
    'programId',
    programId
  );

  // Data.
  const data = getSetCollectionSizeInstructionDataSerializer().serialize(
    resolvedArgs as SetCollectionSizeInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
