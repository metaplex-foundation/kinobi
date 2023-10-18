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
  getU64Decoder,
  getU64Encoder,
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
export type SetComputeUnitPriceInstruction<
  TProgram extends string = 'ComputeBudget111111111111111111111111111111'
> = IInstruction<TProgram> & IInstructionWithData<Uint8Array>;

export type SetComputeUnitPriceInstructionData = {
  discriminator: number;
  /** Transaction compute unit price used for prioritization fees. */
  microLamports: bigint;
};

export type SetComputeUnitPriceInstructionDataArgs = {
  /** Transaction compute unit price used for prioritization fees. */
  microLamports: number | bigint;
};

export function getSetComputeUnitPriceInstructionDataEncoder(): Encoder<SetComputeUnitPriceInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<SetComputeUnitPriceInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['microLamports', getU64Encoder()],
      ],
      { description: 'SetComputeUnitPriceInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 3 } as SetComputeUnitPriceInstructionData)
  ) as Encoder<SetComputeUnitPriceInstructionDataArgs>;
}

export function getSetComputeUnitPriceInstructionDataDecoder(): Decoder<SetComputeUnitPriceInstructionData> {
  return getStructDecoder<SetComputeUnitPriceInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['microLamports', getU64Decoder()],
    ],
    { description: 'SetComputeUnitPriceInstructionData' }
  ) as Decoder<SetComputeUnitPriceInstructionData>;
}

export function getSetComputeUnitPriceInstructionDataCodec(): Codec<
  SetComputeUnitPriceInstructionDataArgs,
  SetComputeUnitPriceInstructionData
> {
  return combineCodec(
    getSetComputeUnitPriceInstructionDataEncoder(),
    getSetComputeUnitPriceInstructionDataDecoder()
  );
}

export function setComputeUnitPriceInstruction<
  TProgram extends string = 'ComputeBudget111111111111111111111111111111'
>(
  args: SetComputeUnitPriceInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'ComputeBudget111111111111111111111111111111' as Base58EncodedAddress<TProgram>
) {
  return {
    data: getSetComputeUnitPriceInstructionDataEncoder().encode(args),
    programAddress,
  } as SetComputeUnitPriceInstruction<TProgram>;
}

// Input.
export type SetComputeUnitPriceInput = {
  microLamports: SetComputeUnitPriceInstructionDataArgs['microLamports'];
};

export async function setComputeUnitPrice<
  TReturn,
  TProgram extends string = 'ComputeBudget111111111111111111111111111111'
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      SetComputeUnitPriceInstruction<TProgram>,
      TReturn
    >,
  input: SetComputeUnitPriceInput
): Promise<TReturn>;
export async function setComputeUnitPrice<
  TProgram extends string = 'ComputeBudget111111111111111111111111111111'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: SetComputeUnitPriceInput
): Promise<WrappedInstruction<SetComputeUnitPriceInstruction<TProgram>>>;
export async function setComputeUnitPrice<
  TProgram extends string = 'ComputeBudget111111111111111111111111111111'
>(
  input: SetComputeUnitPriceInput
): Promise<WrappedInstruction<SetComputeUnitPriceInstruction<TProgram>>>;
export async function setComputeUnitPrice<
  TReturn,
  TProgram extends string = 'ComputeBudget111111111111111111111111111111'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          SetComputeUnitPriceInstruction<TProgram>,
          TReturn
        >)
    | SetComputeUnitPriceInput,
  rawInput?: SetComputeUnitPriceInput
): Promise<
  TReturn | WrappedInstruction<SetComputeUnitPriceInstruction<TProgram>>
> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          SetComputeUnitPriceInstruction<TProgram>,
          TReturn
        >);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as SetComputeUnitPriceInput;

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
  const args = { ...input };

  // Resolve default values.
  // TODO

  // Remaining accounts.
  // TODO

  // Bytes created on chain.
  // TODO

  return {
    instruction: setComputeUnitPriceInstruction(
      args,
      programAddress
    ) as SetComputeUnitPriceInstruction<TProgram>,
    signers: [],
    bytesCreatedOnChain: 0,
  };
}
