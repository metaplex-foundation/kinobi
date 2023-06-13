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
  Serializer,
  Signer,
  TransactionBuilder,
  mapSerializer,
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { addObjectProperty } from '../shared';
import { VerifyArgs, VerifyArgsArgs, getVerifyArgsSerializer } from '../types';

// Accounts.
export type VerifyInstructionAccounts = {
  /** Metadata account */
  metadata: PublicKey | Pda;
  /** Collection Update authority */
  collectionAuthority: Signer;
  /** payer */
  payer?: Signer;
  /** Token Authorization Rules account */
  authorizationRules?: PublicKey | Pda;
  /** Token Authorization Rules Program */
  authorizationRulesProgram?: PublicKey | Pda;
};

// Data.
export type VerifyInstructionData = {
  discriminator: number;
  verifyArgs: VerifyArgs;
};

export type VerifyInstructionDataArgs = { verifyArgs: VerifyArgsArgs };

export function getVerifyInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<VerifyInstructionDataArgs, VerifyInstructionData> {
  const s = context.serializer;
  return mapSerializer<VerifyInstructionDataArgs, any, VerifyInstructionData>(
    s.struct<VerifyInstructionData>(
      [
        ['discriminator', s.u8()],
        ['verifyArgs', getVerifyArgsSerializer(context)],
      ],
      { description: 'VerifyInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 47 })
  ) as Serializer<VerifyInstructionDataArgs, VerifyInstructionData>;
}

// Args.
export type VerifyInstructionArgs = VerifyInstructionDataArgs;

// Instruction.
export function verify(
  context: Pick<Context, 'serializer' | 'programs' | 'payer'>,
  input: VerifyInstructionAccounts & VerifyInstructionArgs
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
    collectionAuthority: [input.collectionAuthority, true] as const,
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
    'authorizationRules',
    input.authorizationRules
      ? ([input.authorizationRules, false] as const)
      : ([programId, false] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'authorizationRulesProgram',
    input.authorizationRulesProgram
      ? ([input.authorizationRulesProgram, false] as const)
      : ([programId, false] as const)
  );
  const resolvedArgs = { ...input, ...resolvingArgs };

  // Metadata.
  keys.push({
    pubkey: publicKey(resolvedAccounts.metadata[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.metadata[1],
  });

  // Collection Authority.
  signers.push(resolvedAccounts.collectionAuthority[0]);
  keys.push({
    pubkey: resolvedAccounts.collectionAuthority[0].publicKey,
    isSigner: true,
    isWritable: resolvedAccounts.collectionAuthority[1],
  });

  // Payer.
  signers.push(resolvedAccounts.payer[0]);
  keys.push({
    pubkey: resolvedAccounts.payer[0].publicKey,
    isSigner: true,
    isWritable: resolvedAccounts.payer[1],
  });

  // Authorization Rules.
  keys.push({
    pubkey: publicKey(resolvedAccounts.authorizationRules[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.authorizationRules[1],
  });

  // Authorization Rules Program.
  keys.push({
    pubkey: publicKey(resolvedAccounts.authorizationRulesProgram[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.authorizationRulesProgram[1],
  });

  // Data.
  const data =
    getVerifyInstructionDataSerializer(context).serialize(resolvedArgs);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
