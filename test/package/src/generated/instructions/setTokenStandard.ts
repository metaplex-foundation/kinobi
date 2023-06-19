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
import { addAccountMeta } from '../shared';

// Accounts.
export type SetTokenStandardInstructionAccounts = {
  /** Metadata account */
  metadata: PublicKey | Pda;
  /** Metadata update authority */
  updateAuthority: Signer;
  /** Mint account */
  mint: PublicKey | Pda;
  /** Edition account */
  edition?: PublicKey | Pda;
};

// Data.
export type SetTokenStandardInstructionData = { discriminator: number };

export type SetTokenStandardInstructionDataArgs = {};

export function getSetTokenStandardInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  SetTokenStandardInstructionDataArgs,
  SetTokenStandardInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    SetTokenStandardInstructionDataArgs,
    any,
    SetTokenStandardInstructionData
  >(
    s.struct<SetTokenStandardInstructionData>([['discriminator', s.u8()]], {
      description: 'SetTokenStandardInstructionData',
    }),
    (value) => ({ ...value, discriminator: 35 })
  ) as Serializer<
    SetTokenStandardInstructionDataArgs,
    SetTokenStandardInstructionData
  >;
}

// Instruction.
export function setTokenStandard(
  context: Pick<Context, 'serializer' | 'programs'>,
  input: SetTokenStandardInstructionAccounts
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
    updateAuthority: [input.updateAuthority, true] as const,
    mint: [input.mint, false] as const,
    edition: [input.edition, false] as const,
  };

  addAccountMeta(keys, signers, resolvedAccounts.metadata, false);
  addAccountMeta(keys, signers, resolvedAccounts.updateAuthority, false);
  addAccountMeta(keys, signers, resolvedAccounts.mint, false);
  addAccountMeta(keys, signers, resolvedAccounts.edition, true);

  // Data.
  const data = getSetTokenStandardInstructionDataSerializer(context).serialize(
    {}
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
