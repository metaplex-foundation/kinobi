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
  TransactionBuilder,
  mapSerializer,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { isWritable } from '../shared';

// Accounts.
export type RevokeUseAuthorityInstructionAccounts = {
  /** Use Authority Record PDA */
  useAuthorityRecord: PublicKey;
  /** Owner */
  owner: Signer;
  /** A Use Authority */
  user: PublicKey;
  /** Owned Token Account Of Mint */
  ownerTokenAccount: PublicKey;
  /** Mint of Metadata */
  mint: PublicKey;
  /** Metadata account */
  metadata: PublicKey;
  /** Token program */
  tokenProgram?: PublicKey;
  /** System program */
  systemProgram?: PublicKey;
  /** Rent info */
  rent?: PublicKey;
};

// Data.
export type RevokeUseAuthorityInstructionData = { discriminator: number };

export type RevokeUseAuthorityInstructionDataArgs = {};

export function getRevokeUseAuthorityInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  RevokeUseAuthorityInstructionDataArgs,
  RevokeUseAuthorityInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    RevokeUseAuthorityInstructionDataArgs,
    RevokeUseAuthorityInstructionData,
    RevokeUseAuthorityInstructionData
  >(
    s.struct<RevokeUseAuthorityInstructionData>([['discriminator', s.u8()]], {
      description: 'RevokeUseAuthorityInstructionData',
    }),
    (value) =>
      ({ ...value, discriminator: 21 } as RevokeUseAuthorityInstructionData)
  ) as Serializer<
    RevokeUseAuthorityInstructionDataArgs,
    RevokeUseAuthorityInstructionData
  >;
}

// Instruction.
export function revokeUseAuthority(
  context: Pick<Context, 'serializer' | 'programs'>,
  input: RevokeUseAuthorityInstructionAccounts
): TransactionBuilder {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = {
    ...context.programs.getPublicKey(
      'mplTokenMetadata',
      'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
    ),
    isWritable: false,
  };

  // Resolved inputs.
  const resolvedAccounts: any = { ...input };
  resolvedAccounts.tokenProgram = resolvedAccounts.tokenProgram ?? {
    ...context.programs.getPublicKey(
      'splToken',
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    ),
    isWritable: false,
  };
  resolvedAccounts.systemProgram = resolvedAccounts.systemProgram ?? {
    ...context.programs.getPublicKey(
      'splSystem',
      '11111111111111111111111111111111'
    ),
    isWritable: false,
  };

  // Use Authority Record.
  keys.push({
    pubkey: resolvedAccounts.useAuthorityRecord,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.useAuthorityRecord, true),
  });

  // Owner.
  signers.push(resolvedAccounts.owner);
  keys.push({
    pubkey: resolvedAccounts.owner.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.owner, true),
  });

  // User.
  keys.push({
    pubkey: resolvedAccounts.user,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.user, false),
  });

  // Owner Token Account.
  keys.push({
    pubkey: resolvedAccounts.ownerTokenAccount,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.ownerTokenAccount, true),
  });

  // Mint.
  keys.push({
    pubkey: resolvedAccounts.mint,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.mint, false),
  });

  // Metadata.
  keys.push({
    pubkey: resolvedAccounts.metadata,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.metadata, false),
  });

  // Token Program.
  keys.push({
    pubkey: resolvedAccounts.tokenProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.tokenProgram, false),
  });

  // System Program.
  keys.push({
    pubkey: resolvedAccounts.systemProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.systemProgram, false),
  });

  // Rent (optional).
  if (resolvedAccounts.rent) {
    keys.push({
      pubkey: resolvedAccounts.rent,
      isSigner: false,
      isWritable: isWritable(resolvedAccounts.rent, false),
    });
  }

  // Data.
  const data = getRevokeUseAuthorityInstructionDataSerializer(
    context
  ).serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
