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
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { isWritable } from '../shared';
import {
  DelegateArgs,
  DelegateArgsArgs,
  getDelegateArgsSerializer,
} from '../types';

// Accounts.
export type DelegateInstructionAccounts = {
  /** Delegate account key (pda of [mint id, delegate role, user id, authority id]) */
  delegateRecord: PublicKey;
  /** Owner of the delegated account */
  delegate: PublicKey;
  /** Metadata account */
  metadata: PublicKey;
  /** Master Edition account */
  masterEdition?: PublicKey;
  /** Mint of metadata */
  mint: PublicKey;
  /** Owned Token Account of mint */
  token?: PublicKey;
  /** Authority to approve the delegation */
  authority?: Signer;
  /** Payer */
  payer?: Signer;
  /** System Program */
  systemProgram?: PublicKey;
  /** Instructions sysvar account */
  sysvarInstructions?: PublicKey;
  /** SPL Token Program */
  splTokenProgram?: PublicKey;
  /** Token Authorization Rules Program */
  authorizationRulesProgram?: PublicKey;
  /** Token Authorization Rules account */
  authorizationRules?: PublicKey;
};

// Data.
export type DelegateInstructionData = {
  discriminator: number;
  delegateArgs: DelegateArgs;
};

export type DelegateInstructionDataArgs = { delegateArgs: DelegateArgsArgs };

export function getDelegateInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<DelegateInstructionDataArgs, DelegateInstructionData> {
  const s = context.serializer;
  return mapSerializer<
    DelegateInstructionDataArgs,
    DelegateInstructionData,
    DelegateInstructionData
  >(
    s.struct<DelegateInstructionData>(
      [
        ['discriminator', s.u8()],
        ['delegateArgs', getDelegateArgsSerializer(context)],
      ],
      { description: 'DelegateInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 48 } as DelegateInstructionData)
  ) as Serializer<DelegateInstructionDataArgs, DelegateInstructionData>;
}

// Args.
export type DelegateInstructionArgs = DelegateInstructionDataArgs;

// Instruction.
export function delegate(
  context: Pick<Context, 'serializer' | 'programs' | 'identity' | 'payer'>,
  input: DelegateInstructionAccounts & DelegateInstructionArgs
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
  const resolvedArgs: any = { ...input };
  resolvedAccounts.masterEdition = resolvedAccounts.masterEdition ?? programId;
  resolvedAccounts.token = resolvedAccounts.token ?? programId;
  resolvedAccounts.authority = resolvedAccounts.authority ?? context.identity;
  resolvedAccounts.payer = resolvedAccounts.payer ?? context.payer;
  resolvedAccounts.systemProgram = resolvedAccounts.systemProgram ?? {
    ...context.programs.getPublicKey(
      'splSystem',
      '11111111111111111111111111111111'
    ),
    isWritable: false,
  };
  resolvedAccounts.sysvarInstructions =
    resolvedAccounts.sysvarInstructions ??
    publicKey('Sysvar1nstructions1111111111111111111111111');
  resolvedAccounts.splTokenProgram =
    resolvedAccounts.splTokenProgram ?? programId;
  resolvedAccounts.authorizationRulesProgram =
    resolvedAccounts.authorizationRulesProgram ?? programId;
  resolvedAccounts.authorizationRules =
    resolvedAccounts.authorizationRules ?? programId;

  // Delegate Record.
  keys.push({
    pubkey: resolvedAccounts.delegateRecord,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.delegateRecord, true),
  });

  // Delegate.
  keys.push({
    pubkey: resolvedAccounts.delegate,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.delegate, false),
  });

  // Metadata.
  keys.push({
    pubkey: resolvedAccounts.metadata,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.metadata, true),
  });

  // Master Edition.
  keys.push({
    pubkey: resolvedAccounts.masterEdition,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.masterEdition, false),
  });

  // Mint.
  keys.push({
    pubkey: resolvedAccounts.mint,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.mint, false),
  });

  // Token.
  keys.push({
    pubkey: resolvedAccounts.token,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.token, true),
  });

  // Authority.
  signers.push(resolvedAccounts.authority);
  keys.push({
    pubkey: resolvedAccounts.authority.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.authority, false),
  });

  // Payer.
  signers.push(resolvedAccounts.payer);
  keys.push({
    pubkey: resolvedAccounts.payer.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.payer, true),
  });

  // System Program.
  keys.push({
    pubkey: resolvedAccounts.systemProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.systemProgram, false),
  });

  // Sysvar Instructions.
  keys.push({
    pubkey: resolvedAccounts.sysvarInstructions,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.sysvarInstructions, false),
  });

  // Spl Token Program.
  keys.push({
    pubkey: resolvedAccounts.splTokenProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.splTokenProgram, false),
  });

  // Authorization Rules Program.
  keys.push({
    pubkey: resolvedAccounts.authorizationRulesProgram,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.authorizationRulesProgram, false),
  });

  // Authorization Rules.
  keys.push({
    pubkey: resolvedAccounts.authorizationRules,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.authorizationRules, false),
  });

  // Data.
  const data =
    getDelegateInstructionDataSerializer(context).serialize(resolvedArgs);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
