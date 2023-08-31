/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Context,
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  array,
  mapSerializer,
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import { resolveTokenOrAta } from '../../hooked';
import { findDelegateRecordPda } from '../accounts';
import {
  PickPartial,
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  expectSome,
  getAccountMetasAndSigners,
} from '../shared';
import { DelegateRole } from '../types';

// Accounts.
export type DummyInstructionAccounts = {
  edition?: Signer;
  mint?: PublicKey | Pda;
  updateAuthority: Signer;
  mintAuthority?: Signer;
  payer?: Signer;
  foo?: PublicKey | Pda;
  bar?: Signer;
  delegate?: Signer;
  delegateRecord?: PublicKey | Pda;
  tokenOrAtaProgram?: PublicKey | Pda;
};

// Data.
export type DummyInstructionData = { discriminator: Array<number> };

export type DummyInstructionDataArgs = {};

export function getDummyInstructionDataSerializer(): Serializer<
  DummyInstructionDataArgs,
  DummyInstructionData
> {
  return mapSerializer<DummyInstructionDataArgs, any, DummyInstructionData>(
    struct<DummyInstructionData>(
      [['discriminator', array(u8(), { size: 8 })]],
      { description: 'DummyInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [167, 117, 211, 79, 251, 254, 47, 135],
    })
  ) as Serializer<DummyInstructionDataArgs, DummyInstructionData>;
}

// Extra Args.
export type DummyInstructionExtraArgs = {
  identityArg: PublicKey;
  proof: Array<PublicKey>;
};

// Args.
export type DummyInstructionArgs = PickPartial<
  DummyInstructionExtraArgs,
  'proof' | 'identityArg'
>;

// Instruction.
export function dummy(
  context: Pick<Context, 'eddsa' | 'identity' | 'payer' | 'programs'>,
  input: DummyInstructionAccounts & DummyInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplCandyMachineCore',
    'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
  );

  // Accounts.
  const resolvedAccounts: ResolvedAccountsWithIndices = {
    edition: { index: 0, isWritable: true, value: input.edition ?? null },
    mint: { index: 1, isWritable: true, value: input.mint ?? null },
    updateAuthority: {
      index: 2,
      isWritable: false,
      value: input.updateAuthority ?? null,
    },
    mintAuthority: {
      index: 3,
      isWritable: true,
      value: input.mintAuthority ?? null,
    },
    payer: { index: 4, isWritable: true, value: input.payer ?? null },
    foo: { index: 5, isWritable: true, value: input.foo ?? null },
    bar: { index: 6, isWritable: false, value: input.bar ?? null },
    delegate: { index: 7, isWritable: false, value: input.delegate ?? null },
    delegateRecord: {
      index: 8,
      isWritable: true,
      value: input.delegateRecord ?? null,
    },
    tokenOrAtaProgram: {
      index: 9,
      isWritable: false,
      value: input.tokenOrAtaProgram ?? null,
    },
  };

  // Arguments.
  const resolvedArgs: DummyInstructionArgs = { ...input };

  // Default values.
  if (!resolvedAccounts.edition.value) {
    resolvedAccounts.edition.value = expectSome(resolvedAccounts.mint.value);
  }
  if (!resolvedAccounts.mintAuthority.value) {
    resolvedAccounts.mintAuthority.value = expectSome(
      resolvedAccounts.updateAuthority.value
    );
  }
  if (!resolvedAccounts.payer.value) {
    resolvedAccounts.payer.value = context.payer;
  }
  if (!resolvedAccounts.foo.value) {
    resolvedAccounts.foo.value = expectSome(resolvedAccounts.bar.value);
  }
  if (!resolvedAccounts.delegateRecord.value) {
    if (resolvedAccounts.delegate.value) {
      resolvedAccounts.delegateRecord.value = findDelegateRecordPda(context, {
        role: DelegateRole.Collection,
      });
    }
  }
  if (!resolvedArgs.proof) {
    resolvedArgs.proof = [];
  }
  if (!resolvedAccounts.tokenOrAtaProgram.value) {
    if (
      resolveTokenOrAta(
        context,
        resolvedAccounts,
        resolvedArgs,
        programId,
        false
      )
    ) {
      resolvedAccounts.tokenOrAtaProgram.value = context.programs.getPublicKey(
        'splToken',
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
      );
      resolvedAccounts.tokenOrAtaProgram.isWritable = false;
    } else {
      resolvedAccounts.tokenOrAtaProgram.value = context.programs.getPublicKey(
        'splAssociatedToken',
        'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
      );
      resolvedAccounts.tokenOrAtaProgram.isWritable = false;
    }
  }
  if (!resolvedArgs.identityArg) {
    resolvedArgs.identityArg = context.identity.publicKey;
  }

  // Accounts in order.
  const orderedAccounts: ResolvedAccount[] = Object.values(
    resolvedAccounts
  ).sort((a, b) => a.index - b.index);

  // Remaining Accounts.
  const remainingAccounts = resolvedArgs.proof.map((value, index) => ({
    index,
    value,
    isWritable: false,
  }));
  orderedAccounts.push(...remainingAccounts);

  // Keys and Signers.
  const [keys, signers] = getAccountMetasAndSigners(
    orderedAccounts,
    'programId',
    programId
  );

  // Data.
  const data = getDummyInstructionDataSerializer().serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
