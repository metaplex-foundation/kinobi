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
import { getU8Decoder, getU8Encoder } from '@solana/codecs-numbers';
import {
  AccountRole,
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  ReadonlyAccount,
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
export type FreezeTokenInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string = string,
  TAccountMint extends string = string,
  TAccountOwner extends string = string
> = IInstruction<TProgram> &
  IInstructionWithData<FreezeTokenInstructionData> &
  IInstructionWithAccounts<
    [
      WritableAccount<TAccountAccount>,
      ReadonlyAccount<TAccountMint>,
      ReadonlySignerAccount<TAccountOwner>
    ]
  >;

export type FreezeTokenInstructionData = { discriminator: number };

export type FreezeTokenInstructionDataArgs = {};

export function getFreezeTokenInstructionDataEncoder(): Encoder<FreezeTokenInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<FreezeTokenInstructionData>(
      [['discriminator', getU8Encoder()]],
      { description: 'FreezeTokenInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 10 } as FreezeTokenInstructionData)
  ) as Encoder<FreezeTokenInstructionDataArgs>;
}

export function getFreezeTokenInstructionDataDecoder(): Decoder<FreezeTokenInstructionData> {
  return getStructDecoder<FreezeTokenInstructionData>(
    [['discriminator', getU8Decoder()]],
    { description: 'FreezeTokenInstructionData' }
  ) as Decoder<FreezeTokenInstructionData>;
}

export function getFreezeTokenInstructionDataCodec(): Codec<
  FreezeTokenInstructionDataArgs,
  FreezeTokenInstructionData
> {
  return combineCodec(
    getFreezeTokenInstructionDataEncoder(),
    getFreezeTokenInstructionDataDecoder()
  );
}

export function freezeTokenInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string = string,
  TAccountMint extends string = string,
  TAccountOwner extends string = string
>(
  accounts: {
    account: Base58EncodedAddress<TAccountAccount>;
    mint: Base58EncodedAddress<TAccountMint>;
    owner: Base58EncodedAddress<TAccountOwner>;
  },
  programAddress: Base58EncodedAddress<TProgram> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<TProgram>
): FreezeTokenInstruction<
  TProgram,
  TAccountAccount,
  TAccountMint,
  TAccountOwner
> {
  return {
    accounts: [
      { address: accounts.account, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.mint, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.owner, role: AccountRole.WRITABLE_SIGNER },
    ],
    data: getFreezeTokenInstructionDataEncoder().encode({}),
    programAddress,
  };
}
