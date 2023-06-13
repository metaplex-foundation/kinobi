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
  isSigner,
  mapSerializer,
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { findDelegateRecordPda } from '../accounts';
import { PickPartial, addObjectProperty } from '../shared';
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
  delegateRecord?: PublicKey | Pda;
};

// Data.
export type DummyInstructionData = { discriminator: Array<number> };

export type DummyInstructionDataArgs = {};

export function getDummyInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<DummyInstructionDataArgs, DummyInstructionData> {
  const s = context.serializer;
  return mapSerializer<DummyInstructionDataArgs, any, DummyInstructionData>(
    s.struct<DummyInstructionData>(
      [['discriminator', s.array(s.u8(), { size: 8 })]],
      { description: 'DummyInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [167, 117, 211, 79, 251, 254, 47, 135],
    })
  ) as Serializer<DummyInstructionDataArgs, DummyInstructionData>;
}

// Extra Args.
export type DummyInstructionExtraArgs = { identityArg: PublicKey };

// Args.
export type DummyInstructionArgs = PickPartial<
  DummyInstructionExtraArgs,
  'identityArg'
>;

// Instruction.
export function dummy(
  context: Pick<
    Context,
    'serializer' | 'programs' | 'eddsa' | 'identity' | 'payer'
  >,
  input: DummyInstructionAccounts & DummyInstructionArgs
): TransactionBuilder {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplCandyMachineCore',
    'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
  );

  // Resolved inputs.
  const resolvedAccounts = {
    updateAuthority: [input.updateAuthority, false] as const,
  };
  const resolvingArgs = {};
  addObjectProperty(
    resolvedAccounts,
    'mint',
    input.mint ? ([input.mint, true] as const) : ([programId, false] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'edition',
    input.edition
      ? ([input.edition, true] as const)
      : ([resolvedAccounts.mint[0], true] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'mintAuthority',
    input.mintAuthority
      ? ([input.mintAuthority, true] as const)
      : ([input.updateAuthority, true] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'payer',
    input.payer
      ? ([input.payer, true] as const)
      : ([context.payer, true] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'bar',
    input.bar ? ([input.bar, false] as const) : ([programId, false] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'foo',
    input.foo
      ? ([input.foo, true] as const)
      : ([resolvedAccounts.bar[0], true] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'delegateRecord',
    input.delegateRecord
      ? ([input.delegateRecord, true] as const)
      : ([
          findDelegateRecordPda(context, { role: DelegateRole.Collection }),
          true,
        ] as const)
  );
  addObjectProperty(
    resolvingArgs,
    'identityArg',
    input.identityArg ?? context.identity.publicKey
  );

  // Edition (optional).
  if (resolvedAccounts.edition[0]) {
    if (isSigner(resolvedAccounts.edition[0])) {
      signers.push(resolvedAccounts.edition[0]);
    }
    keys.push({
      pubkey: publicKey(resolvedAccounts.edition[0], false),
      isSigner: isSigner(resolvedAccounts.edition[0]),
      isWritable: resolvedAccounts.edition[1],
    });
  }

  // Mint.
  keys.push({
    pubkey: publicKey(resolvedAccounts.mint[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.mint[1],
  });

  // Update Authority.
  signers.push(resolvedAccounts.updateAuthority[0]);
  keys.push({
    pubkey: resolvedAccounts.updateAuthority[0].publicKey,
    isSigner: true,
    isWritable: resolvedAccounts.updateAuthority[1],
  });

  // Mint Authority.
  signers.push(resolvedAccounts.mintAuthority[0]);
  keys.push({
    pubkey: resolvedAccounts.mintAuthority[0].publicKey,
    isSigner: true,
    isWritable: resolvedAccounts.mintAuthority[1],
  });

  // Payer.
  signers.push(resolvedAccounts.payer[0]);
  keys.push({
    pubkey: resolvedAccounts.payer[0].publicKey,
    isSigner: true,
    isWritable: resolvedAccounts.payer[1],
  });

  // Foo.
  if (isSigner(resolvedAccounts.foo[0])) {
    signers.push(resolvedAccounts.foo[0]);
  }
  keys.push({
    pubkey: publicKey(resolvedAccounts.foo[0], false),
    isSigner: isSigner(resolvedAccounts.foo[0]),
    isWritable: resolvedAccounts.foo[1],
  });

  // Bar.
  if (isSigner(resolvedAccounts.bar[0])) {
    signers.push(resolvedAccounts.bar[0]);
  }
  keys.push({
    pubkey: publicKey(resolvedAccounts.bar[0], false),
    isSigner: isSigner(resolvedAccounts.bar[0]),
    isWritable: resolvedAccounts.bar[1],
  });

  // Delegate Record.
  keys.push({
    pubkey: publicKey(resolvedAccounts.delegateRecord[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.delegateRecord[1],
  });

  // Data.
  const data = getDummyInstructionDataSerializer(context).serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
