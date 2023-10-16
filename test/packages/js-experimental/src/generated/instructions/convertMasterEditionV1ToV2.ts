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
import { getU8Decoder, getU8Encoder } from '@solana/codecs-numbers';
import {
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  WritableAccount,
} from '@solana/instructions';
import {
  Context,
  Pda,
  PublicKey,
  TransactionBuilder,
  transactionBuilder,
} from 'umi';
import { Serializer } from 'umiSerializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';

// Output.
export type ConvertMasterEditionV1ToV2Instruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMasterEdition extends string = string,
  TAccountOneTimeAuth extends string = string,
  TAccountPrintingMint extends string = string
> = IInstruction<TProgram> &
  IInstructionWithData<ConvertMasterEditionV1ToV2InstructionData> &
  IInstructionWithAccounts<
    [
      WritableAccount<TAccountMasterEdition>,
      WritableAccount<TAccountOneTimeAuth>,
      WritableAccount<TAccountPrintingMint>
    ]
  >;

export type ConvertMasterEditionV1ToV2InstructionData = {
  discriminator: number;
};

export type ConvertMasterEditionV1ToV2InstructionDataArgs = {};

export function getConvertMasterEditionV1ToV2InstructionDataEncoder(): Encoder<ConvertMasterEditionV1ToV2InstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<ConvertMasterEditionV1ToV2InstructionData>(
      [['discriminator', getU8Encoder()]],
      { description: 'ConvertMasterEditionV1ToV2InstructionData' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: 12,
      } as ConvertMasterEditionV1ToV2InstructionData)
  ) as Encoder<ConvertMasterEditionV1ToV2InstructionDataArgs>;
}

export function getConvertMasterEditionV1ToV2InstructionDataDecoder(): Decoder<ConvertMasterEditionV1ToV2InstructionData> {
  return getStructDecoder<ConvertMasterEditionV1ToV2InstructionData>(
    [['discriminator', getU8Decoder()]],
    { description: 'ConvertMasterEditionV1ToV2InstructionData' }
  ) as Decoder<ConvertMasterEditionV1ToV2InstructionData>;
}

export function getConvertMasterEditionV1ToV2InstructionDataCodec(): Codec<
  ConvertMasterEditionV1ToV2InstructionDataArgs,
  ConvertMasterEditionV1ToV2InstructionData
> {
  return combineCodec(
    getConvertMasterEditionV1ToV2InstructionDataEncoder(),
    getConvertMasterEditionV1ToV2InstructionDataDecoder()
  );
}
