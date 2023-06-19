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
  Signer,
  TransactionBuilder,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  mapSerializer,
} from '@metaplex-foundation/umi/serializers';
import { addAccountMeta, addObjectProperty } from '../shared';
import {
  CandyMachineData,
  CandyMachineDataArgs,
  getCandyMachineDataSerializer,
} from '../types';

// Accounts.
export type UpdateCandyMachineInstructionAccounts = {
  candyMachine: PublicKey | Pda;
  authority?: Signer;
};

// Data.
export type UpdateCandyMachineInstructionData = {
  discriminator: Array<number>;
  data: CandyMachineData;
};

export type UpdateCandyMachineInstructionDataArgs = {
  data: CandyMachineDataArgs;
};

export function getUpdateCandyMachineInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  UpdateCandyMachineInstructionDataArgs,
  UpdateCandyMachineInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    UpdateCandyMachineInstructionDataArgs,
    any,
    UpdateCandyMachineInstructionData
  >(
    s.struct<UpdateCandyMachineInstructionData>(
      [
        ['discriminator', s.array(s.u8(), { size: 8 })],
        ['data', getCandyMachineDataSerializer(context)],
      ],
      { description: 'UpdateCandyMachineInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [219, 200, 88, 176, 158, 63, 253, 127],
    })
  ) as Serializer<
    UpdateCandyMachineInstructionDataArgs,
    UpdateCandyMachineInstructionData
  >;
}

// Args.
export type UpdateCandyMachineInstructionArgs =
  UpdateCandyMachineInstructionDataArgs;

// Instruction.
export function updateCandyMachine(
  context: Pick<Context, 'serializer' | 'programs' | 'identity'>,
  input: UpdateCandyMachineInstructionAccounts &
    UpdateCandyMachineInstructionArgs
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
    candyMachine: [input.candyMachine, true] as const,
  };
  const resolvingArgs = {};
  addObjectProperty(
    resolvedAccounts,
    'authority',
    input.authority
      ? ([input.authority, false] as const)
      : ([context.identity, false] as const)
  );
  const resolvedArgs = { ...input, ...resolvingArgs };

  addAccountMeta(keys, signers, resolvedAccounts.candyMachine, false);
  addAccountMeta(keys, signers, resolvedAccounts.authority, false);

  // Data.
  const data =
    getUpdateCandyMachineInstructionDataSerializer(context).serialize(
      resolvedArgs
    );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
