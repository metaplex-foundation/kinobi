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
  getArrayDecoder,
  getArrayEncoder,
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

// Output.
export type SetCollectionInstruction<
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountCandyMachine extends string = string,
  TAccountAuthority extends string = string,
  TAccountAuthorityPda extends string = string,
  TAccountPayer extends string = string,
  TAccountCollectionMint extends string = string,
  TAccountCollectionMetadata extends string = string,
  TAccountCollectionAuthorityRecord extends string = string,
  TAccountNewCollectionUpdateAuthority extends string = string,
  TAccountNewCollectionMetadata extends string = string,
  TAccountNewCollectionMint extends string = string,
  TAccountNewCollectionMasterEdition extends string = string,
  TAccountNewCollectionAuthorityRecord extends string = string,
  TAccountTokenMetadataProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountSystemProgram extends string = '11111111111111111111111111111111'
> = IInstruction<TProgram> &
  IInstructionWithData<SetCollectionInstructionData> &
  IInstructionWithAccounts<
    [
      WritableAccount<TAccountCandyMachine>,
      ReadonlySignerAccount<TAccountAuthority>,
      WritableAccount<TAccountAuthorityPda>,
      ReadonlySignerAccount<TAccountPayer>,
      ReadonlyAccount<TAccountCollectionMint>,
      ReadonlyAccount<TAccountCollectionMetadata>,
      WritableAccount<TAccountCollectionAuthorityRecord>,
      WritableSignerAccount<TAccountNewCollectionUpdateAuthority>,
      ReadonlyAccount<TAccountNewCollectionMetadata>,
      ReadonlyAccount<TAccountNewCollectionMint>,
      ReadonlyAccount<TAccountNewCollectionMasterEdition>,
      WritableAccount<TAccountNewCollectionAuthorityRecord>,
      ReadonlyAccount<TAccountTokenMetadataProgram>,
      ReadonlyAccount<TAccountSystemProgram>
    ]
  >;

export type SetCollectionInstructionData = { discriminator: Array<number> };

export type SetCollectionInstructionDataArgs = {};

export function getSetCollectionInstructionDataEncoder(): Encoder<SetCollectionInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<SetCollectionInstructionData>(
      [['discriminator', getArrayEncoder(getU8Encoder(), { size: 8 })]],
      { description: 'SetCollectionInstructionData' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: [192, 254, 206, 76, 168, 182, 59, 223],
      } as SetCollectionInstructionData)
  ) as Encoder<SetCollectionInstructionDataArgs>;
}

export function getSetCollectionInstructionDataDecoder(): Decoder<SetCollectionInstructionData> {
  return getStructDecoder<SetCollectionInstructionData>(
    [['discriminator', getArrayDecoder(getU8Decoder(), { size: 8 })]],
    { description: 'SetCollectionInstructionData' }
  ) as Decoder<SetCollectionInstructionData>;
}

export function getSetCollectionInstructionDataCodec(): Codec<
  SetCollectionInstructionDataArgs,
  SetCollectionInstructionData
> {
  return combineCodec(
    getSetCollectionInstructionDataEncoder(),
    getSetCollectionInstructionDataDecoder()
  );
}

export function setCollectionInstruction<
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountCandyMachine extends string = string,
  TAccountAuthority extends string = string,
  TAccountAuthorityPda extends string = string,
  TAccountPayer extends string = string,
  TAccountCollectionMint extends string = string,
  TAccountCollectionMetadata extends string = string,
  TAccountCollectionAuthorityRecord extends string = string,
  TAccountNewCollectionUpdateAuthority extends string = string,
  TAccountNewCollectionMetadata extends string = string,
  TAccountNewCollectionMint extends string = string,
  TAccountNewCollectionMasterEdition extends string = string,
  TAccountNewCollectionAuthorityRecord extends string = string,
  TAccountTokenMetadataProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountSystemProgram extends string = '11111111111111111111111111111111'
>(
  accounts: {
    candyMachine: Base58EncodedAddress<TAccountCandyMachine>;
    authority: Base58EncodedAddress<TAccountAuthority>;
    authorityPda: Base58EncodedAddress<TAccountAuthorityPda>;
    payer: Base58EncodedAddress<TAccountPayer>;
    collectionMint: Base58EncodedAddress<TAccountCollectionMint>;
    collectionMetadata: Base58EncodedAddress<TAccountCollectionMetadata>;
    collectionAuthorityRecord: Base58EncodedAddress<TAccountCollectionAuthorityRecord>;
    newCollectionUpdateAuthority: Base58EncodedAddress<TAccountNewCollectionUpdateAuthority>;
    newCollectionMetadata: Base58EncodedAddress<TAccountNewCollectionMetadata>;
    newCollectionMint: Base58EncodedAddress<TAccountNewCollectionMint>;
    newCollectionMasterEdition: Base58EncodedAddress<TAccountNewCollectionMasterEdition>;
    newCollectionAuthorityRecord: Base58EncodedAddress<TAccountNewCollectionAuthorityRecord>;
    tokenMetadataProgram: Base58EncodedAddress<TAccountTokenMetadataProgram>;
    systemProgram: Base58EncodedAddress<TAccountSystemProgram>;
  },
  programAddress: Base58EncodedAddress<TProgram> = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR' as Base58EncodedAddress<TProgram>
): SetCollectionInstruction<
  TProgram,
  TAccountCandyMachine,
  TAccountAuthority,
  TAccountAuthorityPda,
  TAccountPayer,
  TAccountCollectionMint,
  TAccountCollectionMetadata,
  TAccountCollectionAuthorityRecord,
  TAccountNewCollectionUpdateAuthority,
  TAccountNewCollectionMetadata,
  TAccountNewCollectionMint,
  TAccountNewCollectionMasterEdition,
  TAccountNewCollectionAuthorityRecord,
  TAccountTokenMetadataProgram,
  TAccountSystemProgram
> {
  return {
    accounts: [
      { address: accounts.candyMachine, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.authority, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.authorityPda, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.payer, role: AccountRole.WRITABLE_SIGNER },
      { address: accounts.collectionMint, role: AccountRole.WRITABLE_SIGNER },
      {
        address: accounts.collectionMetadata,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: accounts.collectionAuthorityRecord,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: accounts.newCollectionUpdateAuthority,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: accounts.newCollectionMetadata,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: accounts.newCollectionMint,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: accounts.newCollectionMasterEdition,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: accounts.newCollectionAuthorityRecord,
        role: AccountRole.WRITABLE_SIGNER,
      },
      {
        address: accounts.tokenMetadataProgram,
        role: AccountRole.WRITABLE_SIGNER,
      },
      { address: accounts.systemProgram, role: AccountRole.WRITABLE_SIGNER },
    ],
    data: getSetCollectionInstructionDataEncoder().encode({}),
    programAddress,
  };
}