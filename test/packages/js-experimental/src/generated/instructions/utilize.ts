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
import {
  getU64Decoder,
  getU64Encoder,
  getU8Decoder,
  getU8Encoder,
} from '@solana/codecs-numbers';
import {
  AccountRole,
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  ReadonlyAccount,
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

// Output.
export type UtilizeInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string,
  TAccountTokenAccount extends string = string,
  TAccountMint extends string = string,
  TAccountUseAuthority extends string = string,
  TAccountOwner extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAtaProgram extends string = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountRent extends string = 'SysvarRent111111111111111111111111111111111',
  TAccountUseAuthorityRecord extends string = string,
  TAccountBurner extends string = string
> = IInstruction<TProgram> &
  IInstructionWithData<UtilizeInstructionData> &
  IInstructionWithAccounts<
    [
      WritableAccount<TAccountMetadata>,
      WritableAccount<TAccountTokenAccount>,
      WritableAccount<TAccountMint>,
      WritableSignerAccount<TAccountUseAuthority>,
      ReadonlyAccount<TAccountOwner>,
      ReadonlyAccount<TAccountTokenProgram>,
      ReadonlyAccount<TAccountAtaProgram>,
      ReadonlyAccount<TAccountSystemProgram>,
      ReadonlyAccount<TAccountRent>,
      WritableAccount<TAccountUseAuthorityRecord>,
      ReadonlyAccount<TAccountBurner>
    ]
  >;

export type UtilizeInstructionData = {
  discriminator: number;
  numberOfUses: bigint;
};

export type UtilizeInstructionDataArgs = { numberOfUses: number | bigint };

export function getUtilizeInstructionDataEncoder(): Encoder<UtilizeInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<UtilizeInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['numberOfUses', getU64Encoder()],
      ],
      { description: 'UtilizeInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 19 } as UtilizeInstructionData)
  ) as Encoder<UtilizeInstructionDataArgs>;
}

export function getUtilizeInstructionDataDecoder(): Decoder<UtilizeInstructionData> {
  return getStructDecoder<UtilizeInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['numberOfUses', getU64Decoder()],
    ],
    { description: 'UtilizeInstructionData' }
  ) as Decoder<UtilizeInstructionData>;
}

export function getUtilizeInstructionDataCodec(): Codec<
  UtilizeInstructionDataArgs,
  UtilizeInstructionData
> {
  return combineCodec(
    getUtilizeInstructionDataEncoder(),
    getUtilizeInstructionDataDecoder()
  );
}

export function utilizeInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string,
  TAccountTokenAccount extends string = string,
  TAccountMint extends string = string,
  TAccountUseAuthority extends string = string,
  TAccountOwner extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAtaProgram extends string = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountRent extends string = 'SysvarRent111111111111111111111111111111111',
  TAccountUseAuthorityRecord extends string = string,
  TAccountBurner extends string = string
>(
  accounts: {
    metadata: Base58EncodedAddress<TAccountMetadata>;
    tokenAccount: Base58EncodedAddress<TAccountTokenAccount>;
    mint: Base58EncodedAddress<TAccountMint>;
    useAuthority: Base58EncodedAddress<TAccountUseAuthority>;
    owner: Base58EncodedAddress<TAccountOwner>;
    tokenProgram: Base58EncodedAddress<TAccountTokenProgram>;
    ataProgram: Base58EncodedAddress<TAccountAtaProgram>;
    systemProgram: Base58EncodedAddress<TAccountSystemProgram>;
    rent: Base58EncodedAddress<TAccountRent>;
    useAuthorityRecord: Base58EncodedAddress<TAccountUseAuthorityRecord>;
    burner: Base58EncodedAddress<TAccountBurner>;
  },
  args: UtilizeInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<TProgram>
): UtilizeInstruction<
  TProgram,
  TAccountMetadata,
  TAccountTokenAccount,
  TAccountMint,
  TAccountUseAuthority,
  TAccountOwner,
  TAccountTokenProgram,
  TAccountAtaProgram,
  TAccountSystemProgram,
  TAccountRent,
  TAccountUseAuthorityRecord,
  TAccountBurner
> {
  return {
    accounts: [
      { address: accounts.metadata, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.tokenAccount, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.mint, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.useAuthority, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.owner, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.tokenProgram, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.ataProgram, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.systemProgram, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.rent, role: AccountRole.WRITABLE_SIGNER },
      {
        address: accounts.useAuthorityRecord,
        role: AccountRole.WRITABLE_SIGNER,
      },
      { address: accounts.burner, role: AccountRole.WRITABLE_SIGNER },
    ],
    data: getUtilizeInstructionDataEncoder().encode(args),
    programAddress,
  };
}