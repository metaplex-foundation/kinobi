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
  checkForIsWritableOverride as isWritable,
  mapSerializer,
  transactionBuilder,
} from '@metaplex-foundation/umi';

// Accounts.
export type FreezeDelegatedAccountInstructionAccounts = {
  /** Delegate */
  delegate: Signer;
  /** Token account to freeze */
  tokenAccount: PublicKey;
  /** Edition */
  edition: PublicKey;
  /** Token mint */
  mint: PublicKey;
  /** Token Program */
  tokenProgram?: PublicKey;
};

// Data.
export type FreezeDelegatedAccountInstructionData = { discriminator: number };

export type FreezeDelegatedAccountInstructionDataArgs = {};

export function getFreezeDelegatedAccountInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  FreezeDelegatedAccountInstructionDataArgs,
  FreezeDelegatedAccountInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    FreezeDelegatedAccountInstructionDataArgs,
    FreezeDelegatedAccountInstructionData,
    FreezeDelegatedAccountInstructionData
  >(
    s.struct<FreezeDelegatedAccountInstructionData>(
      [['discriminator', s.u8()]],
      { description: 'FreezeDelegatedAccountInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 26 } as FreezeDelegatedAccountInstructionData)
  ) as Serializer<
    FreezeDelegatedAccountInstructionDataArgs,
    FreezeDelegatedAccountInstructionData
  >;
}

// Instruction.
export function freezeDelegatedAccount(
  context: Pick<Context, 'serializer' | 'programs'>,
  input: FreezeDelegatedAccountInstructionAccounts
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

  // Delegate.
  signers.push(resolvedAccounts.delegate);
  keys.push({
    pubkey: resolvedAccounts.delegate.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.delegate, true),
  });

  // Token Account.
  keys.push({
    pubkey: resolvedAccounts.tokenAccount,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.tokenAccount, true),
  });

  // Edition.
  keys.push({
    pubkey: resolvedAccounts.edition,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.edition, false),
  });

  // Mint.
  keys.push({
    pubkey: resolvedAccounts.mint,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.mint, false),
  });

  // Token Program.
  keys.push({
    pubkey: resolvedAccounts.tokenProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.tokenProgram, false),
  });

  // Data.
  const data = getFreezeDelegatedAccountInstructionDataSerializer(
    context
  ).serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
