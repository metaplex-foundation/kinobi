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
  getProgramAddressWithFallback,
  mapSerializer,
} from '@lorisleiva/js-core';
import {
  SetCollectionSizeArgs,
  SetCollectionSizeArgsArgs,
  getSetCollectionSizeArgsSerializer,
} from '../types';

// Accounts.
export type SetCollectionSizeInstructionAccounts = {
  /** Collection Metadata account */
  collectionMetadata: PublicKey;
  /** Collection Update authority */
  collectionAuthority: Signer;
  /** Mint of the Collection */
  collectionMint: PublicKey;
  /** Collection Authority Record PDA */
  collectionAuthorityRecord?: PublicKey;
};

// Arguments.
export type SetCollectionSizeInstructionData = {
  discriminator: number;
  setCollectionSizeArgs: SetCollectionSizeArgs;
};

export type SetCollectionSizeInstructionArgs = {
  setCollectionSizeArgs: SetCollectionSizeArgsArgs;
};

export function getSetCollectionSizeInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  SetCollectionSizeInstructionArgs,
  SetCollectionSizeInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    SetCollectionSizeInstructionArgs,
    SetCollectionSizeInstructionData,
    SetCollectionSizeInstructionData
  >(
    s.struct<SetCollectionSizeInstructionData>(
      [
        ['discriminator', s.u8],
        ['setCollectionSizeArgs', getSetCollectionSizeArgsSerializer(context)],
      ],
      'SetCollectionSizeInstructionArgs'
    ),
    (value) =>
      ({ discriminator: 34, ...value } as SetCollectionSizeInstructionData)
  ) as Serializer<
    SetCollectionSizeInstructionArgs,
    SetCollectionSizeInstructionData
  >;
}

// Instruction.
export function setCollectionSize(
  context: {
    serializer: Context['serializer'];
    programs?: Context['programs'];
  },
  input: SetCollectionSizeInstructionAccounts & SetCollectionSizeInstructionArgs
): WrappedInstruction {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId: PublicKey = getProgramAddressWithFallback(
    context,
    'mplTokenMetadata',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );

  // Resolved accounts.
  const collectionMetadataAccount = input.collectionMetadata;
  const collectionAuthorityAccount = input.collectionAuthority;
  const collectionMintAccount = input.collectionMint;
  const collectionAuthorityRecordAccount = input.collectionAuthorityRecord;

  // Collection Metadata.
  keys.push({
    pubkey: collectionMetadataAccount,
    isSigner: false,
    isWritable: isWritable(collectionMetadataAccount, true),
  });

  // Collection Authority.
  signers.push(collectionAuthorityAccount);
  keys.push({
    pubkey: collectionAuthorityAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(collectionAuthorityAccount, true),
  });

  // Collection Mint.
  keys.push({
    pubkey: collectionMintAccount,
    isSigner: false,
    isWritable: isWritable(collectionMintAccount, false),
  });

  // Collection Authority Record (optional).
  if (collectionAuthorityRecordAccount) {
    keys.push({
      pubkey: collectionAuthorityRecordAccount,
      isSigner: false,
      isWritable: isWritable(collectionAuthorityRecordAccount, false),
    });
  }

  // Data.
  const data =
    getSetCollectionSizeInstructionDataSerializer(context).serialize(input);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain,
  };
}
