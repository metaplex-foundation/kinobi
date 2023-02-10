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
  isSigner,
  mapSerializer,
  publicKey,
} from '@metaplex-foundation/umi-core';

// Accounts.
export type DummyInstructionAccounts = {
  edition?: Signer;
  mint: PublicKey;
  updateAuthority: Signer;
  mintAuthority?: Signer;
  payer?: Signer;
  foo?: PublicKey;
  bar?: Signer;
};

// Arguments.
export type DummyInstructionData = { discriminator: Array<number> };

export type DummyInstructionArgs = {};

export function getDummyInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<DummyInstructionArgs, DummyInstructionData> {
  const s = context.serializer;
  return mapSerializer<
    DummyInstructionArgs,
    DummyInstructionData,
    DummyInstructionData
  >(
    s.struct<DummyInstructionData>(
      [['discriminator', s.array(s.u8, 8)]],
      'DummyInstructionArgs'
    ),
    (value) =>
      ({
        ...value,
        discriminator: [167, 117, 211, 79, 251, 254, 47, 135],
      } as DummyInstructionData)
  ) as Serializer<DummyInstructionArgs, DummyInstructionData>;
}

// Instruction.
export function dummy(
  context: Pick<Context, 'serializer' | 'programs' | 'payer'>,
  input: DummyInstructionAccounts
): WrappedInstruction {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId: PublicKey = context.programs.get(
    'mplCandyMachineCore'
  ).publicKey;

  // Resolved accounts.
  const mintAccount = input.mint;
  const editionAccount = input.edition ?? mintAccount;
  const updateAuthorityAccount = input.updateAuthority;
  const mintAuthorityAccount = input.mintAuthority ?? updateAuthorityAccount;
  const payerAccount = input.payer ?? context.payer;
  const barAccount = input.bar ?? { ...programId, isWritable: false };
  const fooAccount = input.foo ?? barAccount;

  // Edition.
  if (isSigner(editionAccount)) {
    signers.push(editionAccount);
  }
  keys.push({
    pubkey: publicKey(editionAccount),
    isSigner: isSigner(editionAccount),
    isWritable: isWritable(editionAccount, true),
  });

  // Mint.
  keys.push({
    pubkey: mintAccount,
    isSigner: false,
    isWritable: isWritable(mintAccount, true),
  });

  // Update Authority.
  signers.push(updateAuthorityAccount);
  keys.push({
    pubkey: updateAuthorityAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(updateAuthorityAccount, false),
  });

  // Mint Authority.
  signers.push(mintAuthorityAccount);
  keys.push({
    pubkey: mintAuthorityAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(mintAuthorityAccount, true),
  });

  // Payer.
  signers.push(payerAccount);
  keys.push({
    pubkey: payerAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(payerAccount, true),
  });

  // Foo.
  if (isSigner(fooAccount)) {
    signers.push(fooAccount);
  }
  keys.push({
    pubkey: publicKey(fooAccount),
    isSigner: isSigner(fooAccount),
    isWritable: isWritable(fooAccount, true),
  });

  // Bar.
  if (isSigner(barAccount)) {
    signers.push(barAccount);
  }
  keys.push({
    pubkey: publicKey(barAccount),
    isSigner: isSigner(barAccount),
    isWritable: isWritable(barAccount, false),
  });

  // Data.
  const data = getDummyInstructionDataSerializer(context).serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain,
  };
}
