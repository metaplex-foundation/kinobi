import {
  AccountMeta,
  checkForIsWritableOverride as isWritable,
  Context,
  PublicKey,
  publicKey,
  Signer,
  WrappedInstruction,
  getProgramAddressWithFallback,
  isSigner,
} from '@lorisleiva/js-core';
import {
  CreateMasterEditionInstructionArgs,
  getCreateMasterEditionInstructionDataSerializer,
} from './generated';

// Accounts.
export type CreateMasterEditionInstructionAccounts = {
  /** Edition - Default to mint */
  edition?: Signer;
  /** Metadata mint - Optional */
  mint?: PublicKey;
  /** Update authority */
  updateAuthority: Signer;
  /** Mint authority - Defaults to the update authority. */
  mintAuthority?: Signer;
  /** payer */
  payer?: Signer;
  /** Foo - Default to Bar */
  foo?: PublicKey;
  /** Bar - Default to Program ID */
  bar?: Signer;
};

// Instruction.
export function createMasterEdition(
  context: {
    serializer: Context['serializer'];
    eddsa: Context['eddsa'];
    payer: Context['payer'];
    programs?: Context['programs'];
  },
  input: CreateMasterEditionInstructionAccounts &
    CreateMasterEditionInstructionArgs
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
  const mintAccount = input.mint;
  const editionAccount = input.edition ?? mintAccount;
  const updateAuthorityAccount = input.updateAuthority;
  const mintAuthorityAccount = input.mintAuthority ?? updateAuthorityAccount;
  const payerAccount = input.payer ?? context.payer;
  const barAccount = input.bar ?? { ...programId, isWritable: false };
  const fooAccount = input.foo ?? barAccount;

  /** Edition - Default to mint thus can be optional. */
  if (editionAccount) {
    if (isSigner(editionAccount)) {
      signers.push(editionAccount);
    }
    keys.push({
      pubkey: publicKey(editionAccount),
      isSigner: isSigner(editionAccount),
      isWritable: isWritable(editionAccount, true),
    });
  }

  /** Metadata mint - Optional */
  if (mintAccount) {
    keys.push({
      pubkey: mintAccount,
      isSigner: false,
      isWritable: isWritable(mintAccount, true),
    });
  }

  /** Update authority */
  signers.push(updateAuthorityAccount);
  keys.push({
    pubkey: publicKey(updateAuthorityAccount),
    isSigner: true,
    isWritable: isWritable(updateAuthorityAccount, false),
  });

  /** Mint authority - Defaults to the update authority. */
  signers.push(mintAuthorityAccount);
  keys.push({
    pubkey: publicKey(mintAuthorityAccount),
    isSigner: true,
    isWritable: isWritable(mintAuthorityAccount, true),
  });

  /** payer */
  signers.push(payerAccount);
  keys.push({
    pubkey: publicKey(payerAccount),
    isSigner: true,
    isWritable: isWritable(payerAccount, true),
  });

  /** Foo - Default to Bar */
  if (isSigner(fooAccount)) {
    signers.push(fooAccount);
  }
  keys.push({
    pubkey: publicKey(fooAccount),
    isSigner: isSigner(fooAccount),
    isWritable: isWritable(fooAccount, true),
  });

  /** Bar - Default to Program ID */
  if (isSigner(barAccount)) {
    signers.push(barAccount);
  }
  keys.push({
    pubkey: publicKey(barAccount),
    isSigner: isSigner(barAccount),
    isWritable: isWritable(barAccount, false),
  });

  // Data.
  const data =
    getCreateMasterEditionInstructionDataSerializer(context).serialize(input);

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain: 0,
  };
}
