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
export type SetAuthorityInstructionAccounts = {
  candyMachine: PublicKey;
  authority?: Signer;
};

// Data.
export type SetAuthorityInstructionData = {
  discriminator: Array<number>;
  newAuthority: PublicKey;
};

export type SetAuthorityInstructionDataArgs = { newAuthority: PublicKey };

export function getSetAuthorityInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<SetAuthorityInstructionDataArgs, SetAuthorityInstructionData> {
  const s = context.serializer;
  return mapSerializer<
    SetAuthorityInstructionDataArgs,
    SetAuthorityInstructionData,
    SetAuthorityInstructionData
  >(
    s.struct<SetAuthorityInstructionData>(
      [
        ['discriminator', s.array(s.u8(), { size: 8 })],
        ['newAuthority', s.publicKey()],
      ],
      { description: 'SetAuthorityInstructionData' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: [133, 250, 37, 21, 110, 163, 26, 121],
      } as SetAuthorityInstructionData)
  ) as Serializer<SetAuthorityInstructionDataArgs, SetAuthorityInstructionData>;
}

// Args.
export type SetAuthorityInstructionArgs = SetAuthorityInstructionDataArgs;

// Instruction.
export function setAuthority(
  context: Pick<Context, 'serializer' | 'programs' | 'identity'>,
  input: SetAuthorityInstructionAccounts & SetAuthorityInstructionArgs
): TransactionBuilder {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplCandyMachineCore',
    'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
  );

  // Resolved inputs.
  const resolvedAccounts: any = { ...input };
  const resolvedArgs: any = { ...input };
  resolvedAccounts.authority = resolvedAccounts.authority ?? context.identity;

  // Candy Machine.
  keys.push({
    pubkey: resolvedAccounts.candyMachine,
    isSigner: false,
    isWritable: isWritable(resolvedAccounts.candyMachine, true),
  });

  // Authority.
  signers.push(resolvedAccounts.authority);
  keys.push({
    pubkey: resolvedAccounts.authority.publicKey,
    isSigner: true,
    isWritable: isWritable(resolvedAccounts.authority, false),
  });

  // Data.
  const data =
    getSetAuthorityInstructionDataSerializer(context).serialize(resolvedArgs);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
