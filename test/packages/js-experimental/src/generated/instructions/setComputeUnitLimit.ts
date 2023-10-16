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
import { Context, TransactionBuilder, transactionBuilder } from 'umi';
import { Serializer } from 'umiSerializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';

// Output.
export type SetComputeUnitLimitInstruction<
  TProgram extends string = 'ComputeBudget111111111111111111111111111111'
> = IInstruction<TProgram> &
  IInstructionWithData<SetComputeUnitLimitInstructionData>;

export type SetComputeUnitLimitInstructionData = {
  discriminator: number;
  /** Transaction-wide compute unit limit. */
  units: number;
};

export type SetComputeUnitLimitInstructionDataArgs = {
  /** Transaction-wide compute unit limit. */
  units: number;
};

export function getSetComputeUnitLimitInstructionDataEncoder(): Encoder<SetComputeUnitLimitInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<SetComputeUnitLimitInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['units', getU32Encoder()],
      ],
      { description: 'SetComputeUnitLimitInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 2 } as SetComputeUnitLimitInstructionData)
  ) as Encoder<SetComputeUnitLimitInstructionDataArgs>;
}

export function getSetComputeUnitLimitInstructionDataDecoder(): Decoder<SetComputeUnitLimitInstructionData> {
  return getStructDecoder<SetComputeUnitLimitInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['units', getU32Decoder()],
    ],
    { description: 'SetComputeUnitLimitInstructionData' }
  ) as Decoder<SetComputeUnitLimitInstructionData>;
}

export function getSetComputeUnitLimitInstructionDataCodec(): Codec<
  SetComputeUnitLimitInstructionDataArgs,
  SetComputeUnitLimitInstructionData
> {
  return combineCodec(
    getSetComputeUnitLimitInstructionDataEncoder(),
    getSetComputeUnitLimitInstructionDataDecoder()
  );
}

export function setComputeUnitLimitInstruction<
  TProgram extends string = 'ComputeBudget111111111111111111111111111111'
>(
  args: SetComputeUnitLimitInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'ComputeBudget111111111111111111111111111111' as Base58EncodedAddress<TProgram>
): SetComputeUnitLimitInstruction<TProgram> {
  return {
    data: getSetComputeUnitLimitInstructionDataEncoder().encode(args),
    programAddress,
  };
}
