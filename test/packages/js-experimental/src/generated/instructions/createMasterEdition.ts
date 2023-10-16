/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Base58EncodedAddress, address } from '@solana/addresses';
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
  WritableSignerAccount,
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
  CreateMasterEditionArgs,
  CreateMasterEditionArgsArgs,
  getCreateMasterEditionArgsDecoder,
  getCreateMasterEditionArgsEncoder,
} from '../types';

// Output.
export type CreateMasterEditionInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountEdition extends string = string,
  TAccountMint extends string = string,
  TAccountUpdateAuthority extends string = string,
  TAccountMintAuthority extends string = string,
  TAccountPayer extends string = string,
  TAccountMetadata extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountRent extends string = 'SysvarRent111111111111111111111111111111111'
> = IInstruction<TProgram> &
  IInstructionWithData<CreateMasterEditionInstructionData> &
  IInstructionWithAccounts<
    [
      WritableAccount<TAccountEdition>,
      WritableAccount<TAccountMint>,
      ReadonlySignerAccount<TAccountUpdateAuthority>,
      ReadonlySignerAccount<TAccountMintAuthority>,
      WritableSignerAccount<TAccountPayer>,
      ReadonlyAccount<TAccountMetadata>,
      ReadonlyAccount<TAccountTokenProgram>,
      ReadonlyAccount<TAccountSystemProgram>,
      ReadonlyAccount<TAccountRent>
    ]
  >;

export type CreateMasterEditionInstructionData = {
  discriminator: number;
  createMasterEditionArgs: CreateMasterEditionArgs;
};

export type CreateMasterEditionInstructionDataArgs = {
  createMasterEditionArgs: CreateMasterEditionArgsArgs;
};

export function getCreateMasterEditionInstructionDataEncoder(): Encoder<CreateMasterEditionInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<CreateMasterEditionInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['createMasterEditionArgs', getCreateMasterEditionArgsEncoder()],
      ],
      { description: 'CreateMasterEditionInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 10 } as CreateMasterEditionInstructionData)
  ) as Encoder<CreateMasterEditionInstructionDataArgs>;
}

export function getCreateMasterEditionInstructionDataDecoder(): Decoder<CreateMasterEditionInstructionData> {
  return getStructDecoder<CreateMasterEditionInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['createMasterEditionArgs', getCreateMasterEditionArgsDecoder()],
    ],
    { description: 'CreateMasterEditionInstructionData' }
  ) as Decoder<CreateMasterEditionInstructionData>;
}

export function getCreateMasterEditionInstructionDataCodec(): Codec<
  CreateMasterEditionInstructionDataArgs,
  CreateMasterEditionInstructionData
> {
  return combineCodec(
    getCreateMasterEditionInstructionDataEncoder(),
    getCreateMasterEditionInstructionDataDecoder()
  );
}

export function createMasterEditionInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountEdition extends string = string,
  TAccountMint extends string = string,
  TAccountUpdateAuthority extends string = string,
  TAccountMintAuthority extends string = string,
  TAccountPayer extends string = string,
  TAccountMetadata extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountRent extends string = 'SysvarRent111111111111111111111111111111111'
>(
  accounts: {
    edition: Base58EncodedAddress<TAccountEdition>;
    mint: Base58EncodedAddress<TAccountMint>;
    updateAuthority: Base58EncodedAddress<TAccountUpdateAuthority>;
    mintAuthority: Base58EncodedAddress<TAccountMintAuthority>;
    payer: Base58EncodedAddress<TAccountPayer>;
    metadata: Base58EncodedAddress<TAccountMetadata>;
    tokenProgram: Base58EncodedAddress<TAccountTokenProgram>;
    systemProgram: Base58EncodedAddress<TAccountSystemProgram>;
    rent: Base58EncodedAddress<TAccountRent>;
  },
  args: CreateMasterEditionInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<TProgram>
): CreateMasterEditionInstruction<
  TProgram,
  TAccountEdition,
  TAccountMint,
  TAccountUpdateAuthority,
  TAccountMintAuthority,
  TAccountPayer,
  TAccountMetadata,
  TAccountTokenProgram,
  TAccountSystemProgram,
  TAccountRent
> {
  return {
    accounts: [
      { address: accounts.edition, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.mint, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.updateAuthority, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.mintAuthority, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.payer, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.metadata, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.tokenProgram, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.systemProgram, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.rent, role: AccountRole.WRITABLE_SIGNER },
    ],
    data: getCreateMasterEditionInstructionDataEncoder().encode(args),
    programAddress,
  };
}