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
import { ConfigLine, getConfigLineSerializer } from '../types';

// Accounts.
export type AddConfigLinesInstructionAccounts = {
  candyMachine: PublicKey;
  authority?: Signer;
};

// Arguments.
export type AddConfigLinesInstructionData = {
  discriminator: Array<number>;
  index: number;
  configLines: Array<ConfigLine>;
};

export type AddConfigLinesInstructionArgs = {
  index: number;
  configLines: Array<ConfigLine>;
};

export function getAddConfigLinesInstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<AddConfigLinesInstructionArgs, AddConfigLinesInstructionData> {
  const s = context.serializer;
  return mapSerializer<
    AddConfigLinesInstructionArgs,
    AddConfigLinesInstructionData,
    AddConfigLinesInstructionData
  >(
    s.struct<AddConfigLinesInstructionData>(
      [
        ['discriminator', s.array(s.u8, 8)],
        ['index', s.u32],
        ['configLines', s.vec(getConfigLineSerializer(context))],
      ],
      'AddConfigLinesInstructionArgs'
    ),
    (value) =>
      ({
        discriminator: [223, 50, 224, 227, 151, 8, 115, 106],
        ...value,
      } as AddConfigLinesInstructionData)
  ) as Serializer<AddConfigLinesInstructionArgs, AddConfigLinesInstructionData>;
}

// Instruction.
export function addConfigLines(
  context: {
    serializer: Context['serializer'];
    identity: Context['identity'];
    programs?: Context['programs'];
  },
  input: AddConfigLinesInstructionAccounts & AddConfigLinesInstructionArgs
): WrappedInstruction {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId: PublicKey = getProgramAddressWithFallback(
    context,
    'mplCandyMachineCore',
    'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
  );

  // Resolved accounts.
  const candyMachineAccount = input.candyMachine;
  const authorityAccount = input.authority ?? context.identity;

  // Candy Machine.
  keys.push({
    pubkey: candyMachineAccount,
    isSigner: false,
    isWritable: isWritable(candyMachineAccount, true),
  });

  // Authority.
  signers.push(authorityAccount);
  keys.push({
    pubkey: authorityAccount.publicKey,
    isSigner: true,
    isWritable: isWritable(authorityAccount, false),
  });

  // Data.
  const data =
    getAddConfigLinesInstructionDataSerializer(context).serialize(input);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return {
    instruction: { keys, programId, data },
    signers,
    bytesCreatedOnChain,
  };
}
