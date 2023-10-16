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
import { getU8Decoder, getU8Encoder } from '@solana/codecs-numbers';
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

// Output.
export type SetMintAuthorityInstruction<
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountCandyMachine extends string = string,
  TAccountAuthority extends string = string,
  TAccountMintAuthority extends string = string
> = IInstruction<TProgram> &
  IInstructionWithData<SetMintAuthorityInstructionData> &
  IInstructionWithAccounts<
    [
      WritableAccount<TAccountCandyMachine>,
      ReadonlySignerAccount<TAccountAuthority>,
      ReadonlySignerAccount<TAccountMintAuthority>
    ]
  >;

export type SetMintAuthorityInstructionData = { discriminator: Array<number> };

export type SetMintAuthorityInstructionDataArgs = {};

export function getSetMintAuthorityInstructionDataEncoder(): Encoder<SetMintAuthorityInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<SetMintAuthorityInstructionData>(
      [['discriminator', getArrayEncoder(getU8Encoder(), { size: 8 })]],
      { description: 'SetMintAuthorityInstructionData' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: [67, 127, 155, 187, 100, 174, 103, 121],
      } as SetMintAuthorityInstructionData)
  ) as Encoder<SetMintAuthorityInstructionDataArgs>;
}

export function getSetMintAuthorityInstructionDataDecoder(): Decoder<SetMintAuthorityInstructionData> {
  return getStructDecoder<SetMintAuthorityInstructionData>(
    [['discriminator', getArrayDecoder(getU8Decoder(), { size: 8 })]],
    { description: 'SetMintAuthorityInstructionData' }
  ) as Decoder<SetMintAuthorityInstructionData>;
}

export function getSetMintAuthorityInstructionDataCodec(): Codec<
  SetMintAuthorityInstructionDataArgs,
  SetMintAuthorityInstructionData
> {
  return combineCodec(
    getSetMintAuthorityInstructionDataEncoder(),
    getSetMintAuthorityInstructionDataDecoder()
  );
}
