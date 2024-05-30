/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  AccountRole,
  addDecoderSizePrefix,
  addEncoderSizePrefix,
  combineCodec,
  getStructDecoder,
  getStructEncoder,
  getU32Decoder,
  getU32Encoder,
  getUtf8Decoder,
  getUtf8Encoder,
  type Address,
  type Codec,
  type Decoder,
  type Encoder,
  type IAccountMeta,
  type IInstruction,
  type IInstructionWithAccounts,
  type IInstructionWithData,
  type TransactionSigner,
} from '@solana/web3.js';
import { SPL_MEMO_PROGRAM_ADDRESS } from '../programs';

export type AddMemoInstruction<
  TProgram extends string = typeof SPL_MEMO_PROGRAM_ADDRESS,
  TRemainingAccounts extends readonly IAccountMeta<string>[] = [],
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<TRemainingAccounts>;

export type AddMemoInstructionData = { memo: string };

export type AddMemoInstructionDataArgs = AddMemoInstructionData;

export function getAddMemoInstructionDataEncoder(): Encoder<AddMemoInstructionDataArgs> {
  return getStructEncoder([
    ['memo', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
  ]);
}

export function getAddMemoInstructionDataDecoder(): Decoder<AddMemoInstructionData> {
  return getStructDecoder([
    ['memo', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
  ]);
}

export function getAddMemoInstructionDataCodec(): Codec<
  AddMemoInstructionDataArgs,
  AddMemoInstructionData
> {
  return combineCodec(
    getAddMemoInstructionDataEncoder(),
    getAddMemoInstructionDataDecoder()
  );
}

export type AddMemoInput = {
  memo: AddMemoInstructionDataArgs['memo'];
  signers?: Array<TransactionSigner>;
};

export function getAddMemoInstruction(
  input: AddMemoInput
): AddMemoInstruction<typeof SPL_MEMO_PROGRAM_ADDRESS> {
  // Program address.
  const programAddress = SPL_MEMO_PROGRAM_ADDRESS;

  // Original args.
  const args = { ...input };

  // Remaining accounts.
  const remainingAccounts: IAccountMeta[] = (args.signers ?? []).map(
    (signer) => ({
      address: signer.address,
      role: AccountRole.READONLY_SIGNER,
      signer,
    })
  );

  const instruction = {
    accounts: remainingAccounts,
    programAddress,
    data: getAddMemoInstructionDataEncoder().encode(
      args as AddMemoInstructionDataArgs
    ),
  } as AddMemoInstruction<typeof SPL_MEMO_PROGRAM_ADDRESS>;

  return instruction;
}

export type ParsedAddMemoInstruction<
  TProgram extends string = typeof SPL_MEMO_PROGRAM_ADDRESS,
> = {
  programAddress: Address<TProgram>;
  data: AddMemoInstructionData;
};

export function parseAddMemoInstruction<TProgram extends string>(
  instruction: IInstruction<TProgram> & IInstructionWithData<Uint8Array>
): ParsedAddMemoInstruction<TProgram> {
  return {
    programAddress: instruction.programAddress,
    data: getAddMemoInstructionDataDecoder().decode(instruction.data),
  };
}
