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
import { VerifyArgs, getVerifyArgsSerializer } from '../types';

// Accounts.
export type VerifyInstructionAccounts = {
  /** Metadata account */
  metadata: PublicKey;
  /** Collection Update authority */
  collectionAuthority: Signer;
  /** payer */
  payer?: Signer;
  /** Token Authorization Rules account */
  authorizationRules?: PublicKey;
  /** Token Authorization Rules Program */
  authorizationRulesProgram?: PublicKey;
};

// Arguments.
export type VerifyInstructionData = {
  discriminator: number;
  verifyArgs: VerifyArgs;
};

export type VerifyInstructionArgs = { verifyArgs: VerifyArgs };

export function getVerifyInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<VerifyInstructionArgs, VerifyInstructionData> {
  const s = context.serializer;
  return mapSerializer<
    VerifyInstructionArgs,
    VerifyInstructionData,
    VerifyInstructionData
  >(
    s.struct<VerifyInstructionData>(
      [
        ['discriminator', s.u8],
        ['verifyArgs', getVerifyArgsSerializer(context)],
      ],
      'VerifyInstructionArgs'
    ),
    (value) => ({ discriminator: 47, ...value } as VerifyInstructionData)
  ) as Serializer<VerifyInstructionArgs, VerifyInstructionData>;
}

// Instruction.
export function verify(
  context: {
    serializer: Context['serializer'];
    payer: Context['payer'];
    programs?: Context['programs'];
  },
  input: VerifyInstructionAccounts & VerifyInstructionArgs
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
  const metadataAccount = input.metadata;
  const collectionAuthorityAccount = input.collectionAuthority;
  const payerAccount = input.payer ?? context.payer;
  const authorizationRulesAccount = input.authorizationRules;
  const authorizationRulesProgramAccount = input.authorizationRulesProgram;

  // Metadata.
  keys.push({
    pubkey: metadataAccount,
    isSigner: false,
    isWritable: isWritable(metadataAccount, true),
  });

  // Collection Authority.
  signers.push(collectionAuthorityAccount);
  keys.push({
    pubkey: collectionAuthorityAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(collectionAuthorityAccount, true),
  });

  // Payer.
  signers.push(payerAccount);
  keys.push({
    pubkey: payerAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(payerAccount, true),
  });

  // Authorization Rules (optional).
  if (authorizationRulesAccount) {
    keys.push({
      pubkey: authorizationRulesAccount,
      isSigner: false,
      isWritable: isWritable(authorizationRulesAccount, false),
    });
  }

  // Authorization Rules Program (optional).
  if (authorizationRulesProgramAccount) {
    keys.push({
      pubkey: authorizationRulesProgramAccount,
      isSigner: false,
      isWritable: isWritable(authorizationRulesProgramAccount, false),
    });
  }

  // Data.
  const data = getVerifyInstructionDataSerializer(context).serialize(input);

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain: 0,
  };
}
