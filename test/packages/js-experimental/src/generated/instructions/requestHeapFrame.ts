/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Base58EncodedAddress } from '@solana/addresses';
import {
  Codec,
  Decoder,
  Encoder,
  combineCodec,
  mapEncoder,
} from '@solana/codecs-core';
import {
  getStructDecoder,
  getStructEncoder,
} from '@solana/codecs-data-structures';
import {
  getU32Decoder,
  getU32Encoder,
  getU8Decoder,
  getU8Encoder,
} from '@solana/codecs-numbers';
import { IInstruction, IInstructionWithData } from '@solana/instructions';
import {
  Context,
  CustomGeneratedInstruction,
  ResolvedAccount,
  WrappedInstruction,
  getAccountMetasAndSigners,
} from '../shared';

// Output.
export type RequestHeapFrameInstruction<
  TProgram extends string = 'ComputeBudget111111111111111111111111111111'
> = IInstruction<TProgram> & IInstructionWithData<Uint8Array>;

export type RequestHeapFrameInstructionData = {
  discriminator: number;
  /**
   * Requested transaction-wide program heap size in bytes.
   * Must be multiple of 1024. Applies to each program, including CPIs.
   */
  bytes: number;
};

export type RequestHeapFrameInstructionDataArgs = {
  /**
   * Requested transaction-wide program heap size in bytes.
   * Must be multiple of 1024. Applies to each program, including CPIs.
   */
  bytes: number;
};

export function getRequestHeapFrameInstructionDataEncoder(): Encoder<RequestHeapFrameInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<RequestHeapFrameInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['bytes', getU32Encoder()],
      ],
      { description: 'RequestHeapFrameInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 1 } as RequestHeapFrameInstructionData)
  ) as Encoder<RequestHeapFrameInstructionDataArgs>;
}

export function getRequestHeapFrameInstructionDataDecoder(): Decoder<RequestHeapFrameInstructionData> {
  return getStructDecoder<RequestHeapFrameInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['bytes', getU32Decoder()],
    ],
    { description: 'RequestHeapFrameInstructionData' }
  ) as Decoder<RequestHeapFrameInstructionData>;
}

export function getRequestHeapFrameInstructionDataCodec(): Codec<
  RequestHeapFrameInstructionDataArgs,
  RequestHeapFrameInstructionData
> {
  return combineCodec(
    getRequestHeapFrameInstructionDataEncoder(),
    getRequestHeapFrameInstructionDataDecoder()
  );
}

export function requestHeapFrameInstruction<
  TProgram extends string = 'ComputeBudget111111111111111111111111111111'
>(
  args: RequestHeapFrameInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'ComputeBudget111111111111111111111111111111' as Base58EncodedAddress<TProgram>
) {
  return {
    data: getRequestHeapFrameInstructionDataEncoder().encode(args),
    programAddress,
  } as RequestHeapFrameInstruction<TProgram>;
}

// Input.
export type RequestHeapFrameInput = {
  bytes: RequestHeapFrameInstructionDataArgs['bytes'];
};

export async function requestHeapFrame<
  TReturn,
  TProgram extends string = 'ComputeBudget111111111111111111111111111111'
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<RequestHeapFrameInstruction<TProgram>, TReturn>,
  input: RequestHeapFrameInput
): Promise<TReturn>;
export async function requestHeapFrame<
  TProgram extends string = 'ComputeBudget111111111111111111111111111111'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: RequestHeapFrameInput
): Promise<WrappedInstruction<RequestHeapFrameInstruction<TProgram>>>;
export async function requestHeapFrame<
  TProgram extends string = 'ComputeBudget111111111111111111111111111111'
>(
  input: RequestHeapFrameInput
): Promise<WrappedInstruction<RequestHeapFrameInstruction<TProgram>>>;
export async function requestHeapFrame<
  TReturn,
  TProgram extends string = 'ComputeBudget111111111111111111111111111111'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          RequestHeapFrameInstruction<TProgram>,
          TReturn
        >)
    | RequestHeapFrameInput,
  rawInput?: RequestHeapFrameInput
): Promise<
  TReturn | WrappedInstruction<RequestHeapFrameInstruction<TProgram>>
> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          RequestHeapFrameInstruction<TProgram>,
          TReturn
        >);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as RequestHeapFrameInput;

  // Program address.
  const defaultProgramAddress =
    'ComputeBudget111111111111111111111111111111' as Base58EncodedAddress<'ComputeBudget111111111111111111111111111111'>;
  const programAddress = (
    context.getProgramAddress
      ? await context.getProgramAddress({
          name: 'splComputeBudget',
          address: defaultProgramAddress,
        })
      : defaultProgramAddress
  ) as Base58EncodedAddress<TProgram>;

  // Original args.
  const args = {
    amount: input.amount,
  };

  // Resolve default values.
  // TODO

  // Remaining accounts.
  // TODO

  // Bytes created on chain.
  // TODO

  return {
    instruction: requestHeapFrameInstruction(
      args,
      programAddress
    ) as RequestHeapFrameInstruction<TProgram>,
    signers: [],
    bytesCreatedOnChain: 0,
  };
}
