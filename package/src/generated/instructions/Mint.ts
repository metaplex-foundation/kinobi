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
  publicKey,
} from '@lorisleiva/js-core';
import { MintArgs, MintArgsArgs, getMintArgsSerializer } from '../types';

// Accounts.
export type MintInstructionAccounts = {
  /** Token account */
  token: PublicKey;
  /** Metadata account key (pda of ['metadata', program id, mint id]) */
  metadata: PublicKey;
  /** Master Edition account */
  masterEdition?: PublicKey;
  /** Mint of token asset */
  mint: PublicKey;
  /** Payer */
  payer?: Signer;
  /** (Mint or Update) authority */
  authority?: Signer;
  /** System program */
  systemProgram?: PublicKey;
  /** Instructions sysvar account */
  sysvarInstructions?: PublicKey;
  /** SPL Token program */
  splTokenProgram?: PublicKey;
  /** SPL Associated Token Account program */
  splAtaProgram?: PublicKey;
  /** Token Authorization Rules program */
  authorizationRulesProgram?: PublicKey;
  /** Token Authorization Rules account */
  authorizationRules?: PublicKey;
};

// Arguments.
export type MintInstructionData = { discriminator: number; mintArgs: MintArgs };

export type MintInstructionArgs = { mintArgs: MintArgsArgs };

export function getMintInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<MintInstructionArgs, MintInstructionData> {
  const s = context.serializer;
  return mapSerializer<
    MintInstructionArgs,
    MintInstructionData,
    MintInstructionData
  >(
    s.struct<MintInstructionData>(
      [
        ['discriminator', s.u8],
        ['mintArgs', getMintArgsSerializer(context)],
      ],
      'MintInstructionArgs'
    ),
    (value) => ({ discriminator: 42, ...value } as MintInstructionData)
  ) as Serializer<MintInstructionArgs, MintInstructionData>;
}

// Instruction.
export function mint(
  context: {
    serializer: Context['serializer'];
    identity: Context['identity'];
    payer: Context['payer'];
    programs?: Context['programs'];
  },
  input: MintInstructionAccounts & MintInstructionArgs
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
  const tokenAccount = input.token;
  const metadataAccount = input.metadata;
  const masterEditionAccount = input.masterEdition;
  const mintAccount = input.mint;
  const payerAccount = input.payer ?? context.payer;
  const authorityAccount = input.authority ?? context.identity;
  const systemProgramAccount = input.systemProgram ?? {
    ...getProgramAddressWithFallback(
      context,
      'splSystem',
      '11111111111111111111111111111111'
    ),
    isWritable: false,
  };
  const sysvarInstructionsAccount =
    input.sysvarInstructions ??
    publicKey('Sysvar1nstructions1111111111111111111111111');
  const splTokenProgramAccount = input.splTokenProgram ?? {
    ...getProgramAddressWithFallback(
      context,
      'splToken',
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    ),
    isWritable: false,
  };
  const splAtaProgramAccount = input.splAtaProgram ?? {
    ...getProgramAddressWithFallback(
      context,
      'splAssociatedToken',
      'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
    ),
    isWritable: false,
  };
  const authorizationRulesProgramAccount = input.authorizationRulesProgram;
  const authorizationRulesAccount = input.authorizationRules;

  // Token.
  keys.push({
    pubkey: tokenAccount,
    isSigner: false,
    isWritable: isWritable(tokenAccount, true),
  });

  // Metadata.
  keys.push({
    pubkey: metadataAccount,
    isSigner: false,
    isWritable: isWritable(metadataAccount, false),
  });

  // Master Edition (optional).
  if (masterEditionAccount) {
    keys.push({
      pubkey: masterEditionAccount,
      isSigner: false,
      isWritable: isWritable(masterEditionAccount, false),
    });
  }

  // Mint.
  keys.push({
    pubkey: mintAccount,
    isSigner: false,
    isWritable: isWritable(mintAccount, true),
  });

  // Payer.
  signers.push(payerAccount);
  keys.push({
    pubkey: payerAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(payerAccount, true),
  });

  // Authority.
  signers.push(authorityAccount);
  keys.push({
    pubkey: authorityAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(authorityAccount, false),
  });

  // System Program.
  keys.push({
    pubkey: systemProgramAccount,
    isSigner: false,
    isWritable: isWritable(systemProgramAccount, false),
  });

  // Sysvar Instructions.
  keys.push({
    pubkey: sysvarInstructionsAccount,
    isSigner: false,
    isWritable: isWritable(sysvarInstructionsAccount, false),
  });

  // Spl Token Program.
  keys.push({
    pubkey: splTokenProgramAccount,
    isSigner: false,
    isWritable: isWritable(splTokenProgramAccount, false),
  });

  // Spl Ata Program.
  keys.push({
    pubkey: splAtaProgramAccount,
    isSigner: false,
    isWritable: isWritable(splAtaProgramAccount, false),
  });

  // Authorization Rules Program (optional).
  if (authorizationRulesProgramAccount) {
    keys.push({
      pubkey: authorizationRulesProgramAccount,
      isSigner: false,
      isWritable: isWritable(authorizationRulesProgramAccount, false),
    });
  }

  // Authorization Rules (optional).
  if (authorizationRulesAccount) {
    keys.push({
      pubkey: authorizationRulesAccount,
      isSigner: false,
      isWritable: isWritable(authorizationRulesAccount, false),
    });
  }

  // Data.
  const data = getMintInstructionDataSerializer(context).serialize(input);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain,
  };
}
