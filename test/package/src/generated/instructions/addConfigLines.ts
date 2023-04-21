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
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { isWritable } from '../shared';
import { ConfigLine, ConfigLineArgs, getConfigLineSerializer } from '../types';

// Accounts.
export type AddConfigLinesInstructionAccounts = {
  candyMachine: PublicKey;
  authority?: Signer;
};

// Data.
export type AddConfigLinesInstructionData = {
  discriminator: Array<number>;
  index: number;
  configLines: Array<ConfigLine>;
};

export type AddConfigLinesInstructionDataArgs = {
  index: number;
  configLines: Array<ConfigLineArgs>;
};

export function getAddConfigLinesInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<
  AddConfigLinesInstructionDataArgs,
  AddConfigLinesInstructionData
> {
  const s = context.serializer;
  return mapSerializer<
    AddConfigLinesInstructionDataArgs,
    AddConfigLinesInstructionData,
    AddConfigLinesInstructionData
  >(
    s.struct<AddConfigLinesInstructionData>(
      [
        ['discriminator', s.array(s.u8(), { size: 8 })],
        ['index', s.u32()],
        ['configLines', s.array(getConfigLineSerializer(context))],
      ],
      { description: 'AddConfigLinesInstructionData' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: [223, 50, 224, 227, 151, 8, 115, 106],
      } as AddConfigLinesInstructionData)
  ) as Serializer<
    AddConfigLinesInstructionDataArgs,
    AddConfigLinesInstructionData
  >;
}

// Args.
export type AddConfigLinesInstructionArgs = AddConfigLinesInstructionDataArgs;

// Instruction.
export function addConfigLines(
  context: Pick<Context, 'serializer' | 'programs' | 'identity'>,
  input: AddConfigLinesInstructionAccounts & AddConfigLinesInstructionArgs
): TransactionBuilder {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = {
    ...context.programs.getPublicKey(
      'mplCandyMachineCore',
      'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
    ),
    isWritable: false,
  };

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
    getAddConfigLinesInstructionDataSerializer(context).serialize(resolvedArgs);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
