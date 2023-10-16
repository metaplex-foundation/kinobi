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
  getArrayDecoder,
  getArrayEncoder,
  getStructDecoder,
  getStructEncoder,
} from '@solana/codecs-data-structures';
import {
  getU32Decoder,
  getU32Encoder,
  getU8Decoder,
  getU8Encoder,
} from '@solana/codecs-numbers';
import {
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  ReadonlySignerAccount,
  WritableAccount,
} from '@solana/instructions';
import {
  Context,
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  transactionBuilder,
} from 'umi';
import { Serializer } from 'umiSerializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';
import {
  ConfigLine,
  ConfigLineArgs,
  getConfigLineDecoder,
  getConfigLineEncoder,
} from '../types';

// Output.
export type AddConfigLinesInstruction<
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountCandyMachine extends string = string,
  TAccountAuthority extends string = string
> = IInstruction<TProgram> &
  IInstructionWithData<AddConfigLinesInstructionData> &
  IInstructionWithAccounts<
    [
      WritableAccount<TAccountCandyMachine>,
      ReadonlySignerAccount<TAccountAuthority>
    ]
  >;

export type AddConfigLinesInstructionData = {
  discriminator: Array<number>;
  index: number;
  configLines: Array<ConfigLine>;
};

export type AddConfigLinesInstructionDataArgs = {
  index: number;
  configLines: Array<ConfigLineArgs>;
};

export function getAddConfigLinesInstructionDataEncoder(): Encoder<AddConfigLinesInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<AddConfigLinesInstructionData>(
      [
        ['discriminator', getArrayEncoder(getU8Encoder(), { size: 8 })],
        ['index', getU32Encoder()],
        ['configLines', getArrayEncoder(getConfigLineEncoder())],
      ],
      { description: 'AddConfigLinesInstructionData' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: [223, 50, 224, 227, 151, 8, 115, 106],
      } as AddConfigLinesInstructionData)
  ) as Encoder<AddConfigLinesInstructionDataArgs>;
}

export function getAddConfigLinesInstructionDataDecoder(): Decoder<AddConfigLinesInstructionData> {
  return getStructDecoder<AddConfigLinesInstructionData>(
    [
      ['discriminator', getArrayDecoder(getU8Decoder(), { size: 8 })],
      ['index', getU32Decoder()],
      ['configLines', getArrayDecoder(getConfigLineDecoder())],
    ],
    { description: 'AddConfigLinesInstructionData' }
  ) as Decoder<AddConfigLinesInstructionData>;
}

export function getAddConfigLinesInstructionDataCodec(): Codec<
  AddConfigLinesInstructionDataArgs,
  AddConfigLinesInstructionData
> {
  return combineCodec(
    getAddConfigLinesInstructionDataEncoder(),
    getAddConfigLinesInstructionDataDecoder()
  );
}
