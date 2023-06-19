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
} from '@metaplex-foundation/umi/serializers';
import { addAccountMeta, addObjectProperty } from '../shared';

// Accounts.
export type BurnEditionNftInstructionAccounts = {
  /** Metadata (pda of ['metadata', program id, mint id]) */
  metadata: PublicKey | Pda;
  /** NFT owner */
  owner: Signer;
  /** Mint of the print edition NFT */
  printEditionMint: PublicKey | Pda;
  /** Mint of the original/master NFT */
  masterEditionMint: PublicKey | Pda;
  /** Token account the print edition NFT is in */
  printEditionTokenAccount: PublicKey | Pda;
  /** Token account the Master Edition NFT is in */
  masterEditionTokenAccount: PublicKey | Pda;
  /** MasterEdition2 of the original NFT */
  masterEditionAccount: PublicKey | Pda;
  /** Print Edition account of the NFT */
  printEditionAccount: PublicKey | Pda;
  /** Edition Marker PDA of the NFT */
  editionMarkerAccount: PublicKey | Pda;
  /** SPL Token Program */
  splTokenProgram?: PublicKey | Pda;
};

// Data.
export type BurnEditionNftInstructionData = { discriminator: number };

export type BurnEditionNftInstructionDataArgs = {};

export function getBurnEditionNftInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  BurnEditionNftInstructionDataArgs,
  BurnEditionNftInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    BurnEditionNftInstructionDataArgs,
    any,
    BurnEditionNftInstructionData
  >(
    s.struct<BurnEditionNftInstructionData>([['discriminator', s.u8()]], {
      description: 'BurnEditionNftInstructionData',
    }),
    (value) => ({ ...value, discriminator: 37 })
  ) as Serializer<
    BurnEditionNftInstructionDataArgs,
    BurnEditionNftInstructionData
  >;
}

// Instruction.
export function burnEditionNft(
  context: Pick<Context, 'serializer' | 'programs'>,
  input: BurnEditionNftInstructionAccounts
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
    owner: [input.owner, true] as const,
    printEditionMint: [input.printEditionMint, true] as const,
    masterEditionMint: [input.masterEditionMint, false] as const,
    printEditionTokenAccount: [input.printEditionTokenAccount, true] as const,
    masterEditionTokenAccount: [
      input.masterEditionTokenAccount,
      false,
    ] as const,
    masterEditionAccount: [input.masterEditionAccount, true] as const,
    printEditionAccount: [input.printEditionAccount, true] as const,
    editionMarkerAccount: [input.editionMarkerAccount, true] as const,
  };
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

  addAccountMeta(keys, signers, resolvedAccounts.metadata, false);
  addAccountMeta(keys, signers, resolvedAccounts.owner, false);
  addAccountMeta(keys, signers, resolvedAccounts.printEditionMint, false);
  addAccountMeta(keys, signers, resolvedAccounts.masterEditionMint, false);
  addAccountMeta(
    keys,
    signers,
    resolvedAccounts.printEditionTokenAccount,
    false
  );
  addAccountMeta(
    keys,
    signers,
    resolvedAccounts.masterEditionTokenAccount,
    false
  );
  addAccountMeta(keys, signers, resolvedAccounts.masterEditionAccount, false);
  addAccountMeta(keys, signers, resolvedAccounts.printEditionAccount, false);
  addAccountMeta(keys, signers, resolvedAccounts.editionMarkerAccount, false);
  addAccountMeta(keys, signers, resolvedAccounts.splTokenProgram, false);

  // Data.
  const data = getBurnEditionNftInstructionDataSerializer(context).serialize(
    {}
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
