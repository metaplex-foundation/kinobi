/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

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
export type RequestHeapFrameInstruction<
  TProgram extends string = 'ComputeBudget111111111111111111111111111111'
> = IInstruction<TProgram> &
  IInstructionWithData<RequestHeapFrameInstructionData>;

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
