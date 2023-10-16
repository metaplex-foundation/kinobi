/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Base58EncodedAddress,
  getAddressDecoder,
  getAddressEncoder,
} from '@solana/addresses';
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
  AccountRole,
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  ReadonlyAccount,
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
export type InitializeToken3Instruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string = string,
  TAccountMint extends string = string
> = IInstruction<TProgram> &
  IInstructionWithData<InitializeToken3InstructionData> &
  IInstructionWithAccounts<
    [WritableAccount<TAccountAccount>, ReadonlyAccount<TAccountMint>]
  >;

export type InitializeToken3InstructionData = {
  discriminator: number;
  owner: Base58EncodedAddress;
};

export type InitializeToken3InstructionDataArgs = {
  owner: Base58EncodedAddress;
};

export function getInitializeToken3InstructionDataEncoder(): Encoder<InitializeToken3InstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<InitializeToken3InstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['owner', getAddressEncoder()],
      ],
      { description: 'InitializeToken3InstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 18 } as InitializeToken3InstructionData)
  ) as Encoder<InitializeToken3InstructionDataArgs>;
}

export function getInitializeToken3InstructionDataDecoder(): Decoder<InitializeToken3InstructionData> {
  return getStructDecoder<InitializeToken3InstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['owner', getAddressDecoder()],
    ],
    { description: 'InitializeToken3InstructionData' }
  ) as Decoder<InitializeToken3InstructionData>;
}

export function getInitializeToken3InstructionDataCodec(): Codec<
  InitializeToken3InstructionDataArgs,
  InitializeToken3InstructionData
> {
  return combineCodec(
    getInitializeToken3InstructionDataEncoder(),
    getInitializeToken3InstructionDataDecoder()
  );
}

export function initializeToken3Instruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string = string,
  TAccountMint extends string = string
>(
  accounts: {
    account: Base58EncodedAddress<TAccountAccount>;
    mint: Base58EncodedAddress<TAccountMint>;
  },
  args: InitializeToken3InstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<TProgram>
): InitializeToken3Instruction<TProgram, TAccountAccount, TAccountMint> {
  return {
    accounts: [
      { address: accounts.account, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.mint, role: AccountRole.WRITABLE_SIGNER },
    ],
    data: getInitializeToken3InstructionDataEncoder().encode(args),
    programAddress,
  };
}