/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Address } from '@solana/addresses';
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
  IAccountMeta,
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  ReadonlyAccount,
  ReadonlySignerAccount,
  WritableAccount,
  WritableSignerAccount,
} from '@solana/instructions';
import { IAccountSignerMeta, TransactionSigner } from '@solana/signers';
import {
  Context,
  ResolvedAccount,
  accountMetaWithDefault,
  getAccountMetasWithSigners,
  getProgramAddress,
} from '../shared';
import {
  CandyMachineData,
  CandyMachineDataArgs,
  getCandyMachineDataDecoder,
  getCandyMachineDataEncoder,
} from '../types';

// Output.
export type InitializeInstruction<
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountCandyMachine extends string | IAccountMeta<string> = string,
  TAccountAuthorityPda extends string | IAccountMeta<string> = string,
  TAccountAuthority extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountCollectionMetadata extends string | IAccountMeta<string> = string,
  TAccountCollectionMint extends string | IAccountMeta<string> = string,
  TAccountCollectionMasterEdition extends
    | string
    | IAccountMeta<string> = string,
  TAccountCollectionUpdateAuthority extends
    | string
    | IAccountMeta<string> = string,
  TAccountCollectionAuthorityRecord extends
    | string
    | IAccountMeta<string> = string,
  TAccountTokenMetadataProgram extends
    | string
    | IAccountMeta<string> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountCandyMachine extends string
        ? WritableAccount<TAccountCandyMachine>
        : TAccountCandyMachine,
      TAccountAuthorityPda extends string
        ? WritableAccount<TAccountAuthorityPda>
        : TAccountAuthorityPda,
      TAccountAuthority extends string
        ? ReadonlyAccount<TAccountAuthority>
        : TAccountAuthority,
      TAccountPayer extends string
        ? ReadonlySignerAccount<TAccountPayer>
        : TAccountPayer,
      TAccountCollectionMetadata extends string
        ? ReadonlyAccount<TAccountCollectionMetadata>
        : TAccountCollectionMetadata,
      TAccountCollectionMint extends string
        ? ReadonlyAccount<TAccountCollectionMint>
        : TAccountCollectionMint,
      TAccountCollectionMasterEdition extends string
        ? ReadonlyAccount<TAccountCollectionMasterEdition>
        : TAccountCollectionMasterEdition,
      TAccountCollectionUpdateAuthority extends string
        ? WritableSignerAccount<TAccountCollectionUpdateAuthority>
        : TAccountCollectionUpdateAuthority,
      TAccountCollectionAuthorityRecord extends string
        ? WritableAccount<TAccountCollectionAuthorityRecord>
        : TAccountCollectionAuthorityRecord,
      TAccountTokenMetadataProgram extends string
        ? ReadonlyAccount<TAccountTokenMetadataProgram>
        : TAccountTokenMetadataProgram,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      ...TRemainingAccounts
    ]
  >;

// Output.
export type InitializeInstructionWithSigners<
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountCandyMachine extends string | IAccountMeta<string> = string,
  TAccountAuthorityPda extends string | IAccountMeta<string> = string,
  TAccountAuthority extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountCollectionMetadata extends string | IAccountMeta<string> = string,
  TAccountCollectionMint extends string | IAccountMeta<string> = string,
  TAccountCollectionMasterEdition extends
    | string
    | IAccountMeta<string> = string,
  TAccountCollectionUpdateAuthority extends
    | string
    | IAccountMeta<string> = string,
  TAccountCollectionAuthorityRecord extends
    | string
    | IAccountMeta<string> = string,
  TAccountTokenMetadataProgram extends
    | string
    | IAccountMeta<string> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountCandyMachine extends string
        ? WritableAccount<TAccountCandyMachine>
        : TAccountCandyMachine,
      TAccountAuthorityPda extends string
        ? WritableAccount<TAccountAuthorityPda>
        : TAccountAuthorityPda,
      TAccountAuthority extends string
        ? ReadonlyAccount<TAccountAuthority>
        : TAccountAuthority,
      TAccountPayer extends string
        ? ReadonlySignerAccount<TAccountPayer> &
            IAccountSignerMeta<TAccountPayer>
        : TAccountPayer,
      TAccountCollectionMetadata extends string
        ? ReadonlyAccount<TAccountCollectionMetadata>
        : TAccountCollectionMetadata,
      TAccountCollectionMint extends string
        ? ReadonlyAccount<TAccountCollectionMint>
        : TAccountCollectionMint,
      TAccountCollectionMasterEdition extends string
        ? ReadonlyAccount<TAccountCollectionMasterEdition>
        : TAccountCollectionMasterEdition,
      TAccountCollectionUpdateAuthority extends string
        ? WritableSignerAccount<TAccountCollectionUpdateAuthority> &
            IAccountSignerMeta<TAccountCollectionUpdateAuthority>
        : TAccountCollectionUpdateAuthority,
      TAccountCollectionAuthorityRecord extends string
        ? WritableAccount<TAccountCollectionAuthorityRecord>
        : TAccountCollectionAuthorityRecord,
      TAccountTokenMetadataProgram extends string
        ? ReadonlyAccount<TAccountTokenMetadataProgram>
        : TAccountTokenMetadataProgram,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      ...TRemainingAccounts
    ]
  >;

export type InitializeInstructionData = {
  discriminator: Array<number>;
  data: CandyMachineData;
};

export type InitializeInstructionDataArgs = { data: CandyMachineDataArgs };

export function getInitializeInstructionDataEncoder() {
  return mapEncoder(
    getStructEncoder<{
      discriminator: Array<number>;
      data: CandyMachineDataArgs;
    }>([
      ['discriminator', getArrayEncoder(getU8Encoder(), { size: 8 })],
      ['data', getCandyMachineDataEncoder()],
    ]),
    (value) => ({
      ...value,
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
    })
  ) satisfies Encoder<InitializeInstructionDataArgs>;
}

export function getInitializeInstructionDataDecoder() {
  return getStructDecoder<InitializeInstructionData>([
    ['discriminator', getArrayDecoder(getU8Decoder(), { size: 8 })],
    ['data', getCandyMachineDataDecoder()],
  ]) satisfies Decoder<InitializeInstructionData>;
}

export function getInitializeInstructionDataCodec(): Codec<
  InitializeInstructionDataArgs,
  InitializeInstructionData
> {
  return combineCodec(
    getInitializeInstructionDataEncoder(),
    getInitializeInstructionDataDecoder()
  );
}

export function getInitializeInstructionRaw<
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountCandyMachine extends string | IAccountMeta<string> = string,
  TAccountAuthorityPda extends string | IAccountMeta<string> = string,
  TAccountAuthority extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountCollectionMetadata extends string | IAccountMeta<string> = string,
  TAccountCollectionMint extends string | IAccountMeta<string> = string,
  TAccountCollectionMasterEdition extends
    | string
    | IAccountMeta<string> = string,
  TAccountCollectionUpdateAuthority extends
    | string
    | IAccountMeta<string> = string,
  TAccountCollectionAuthorityRecord extends
    | string
    | IAccountMeta<string> = string,
  TAccountTokenMetadataProgram extends
    | string
    | IAccountMeta<string> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
>(
  accounts: {
    candyMachine: TAccountCandyMachine extends string
      ? Address<TAccountCandyMachine>
      : TAccountCandyMachine;
    authorityPda: TAccountAuthorityPda extends string
      ? Address<TAccountAuthorityPda>
      : TAccountAuthorityPda;
    authority: TAccountAuthority extends string
      ? Address<TAccountAuthority>
      : TAccountAuthority;
    payer: TAccountPayer extends string
      ? Address<TAccountPayer>
      : TAccountPayer;
    collectionMetadata: TAccountCollectionMetadata extends string
      ? Address<TAccountCollectionMetadata>
      : TAccountCollectionMetadata;
    collectionMint: TAccountCollectionMint extends string
      ? Address<TAccountCollectionMint>
      : TAccountCollectionMint;
    collectionMasterEdition: TAccountCollectionMasterEdition extends string
      ? Address<TAccountCollectionMasterEdition>
      : TAccountCollectionMasterEdition;
    collectionUpdateAuthority: TAccountCollectionUpdateAuthority extends string
      ? Address<TAccountCollectionUpdateAuthority>
      : TAccountCollectionUpdateAuthority;
    collectionAuthorityRecord: TAccountCollectionAuthorityRecord extends string
      ? Address<TAccountCollectionAuthorityRecord>
      : TAccountCollectionAuthorityRecord;
    tokenMetadataProgram?: TAccountTokenMetadataProgram extends string
      ? Address<TAccountTokenMetadataProgram>
      : TAccountTokenMetadataProgram;
    systemProgram?: TAccountSystemProgram extends string
      ? Address<TAccountSystemProgram>
      : TAccountSystemProgram;
  },
  args: InitializeInstructionDataArgs,
  programAddress: Address<TProgram> = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR' as Address<TProgram>,
  remainingAccounts?: TRemainingAccounts
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.candyMachine, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.authorityPda, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.authority, AccountRole.READONLY),
      accountMetaWithDefault(accounts.payer, AccountRole.READONLY_SIGNER),
      accountMetaWithDefault(accounts.collectionMetadata, AccountRole.READONLY),
      accountMetaWithDefault(accounts.collectionMint, AccountRole.READONLY),
      accountMetaWithDefault(
        accounts.collectionMasterEdition,
        AccountRole.READONLY
      ),
      accountMetaWithDefault(
        accounts.collectionUpdateAuthority,
        AccountRole.WRITABLE_SIGNER
      ),
      accountMetaWithDefault(
        accounts.collectionAuthorityRecord,
        AccountRole.WRITABLE
      ),
      accountMetaWithDefault(
        accounts.tokenMetadataProgram ?? {
          address:
            'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
      accountMetaWithDefault(
        accounts.systemProgram ?? {
          address:
            '11111111111111111111111111111111' as Address<'11111111111111111111111111111111'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
      ...(remainingAccounts ?? []),
    ],
    data: getInitializeInstructionDataEncoder().encode(args),
    programAddress,
  } as InitializeInstruction<
    TProgram,
    TAccountCandyMachine,
    TAccountAuthorityPda,
    TAccountAuthority,
    TAccountPayer,
    TAccountCollectionMetadata,
    TAccountCollectionMint,
    TAccountCollectionMasterEdition,
    TAccountCollectionUpdateAuthority,
    TAccountCollectionAuthorityRecord,
    TAccountTokenMetadataProgram,
    TAccountSystemProgram,
    TRemainingAccounts
  >;
}

// Input.
export type InitializeInput<
  TAccountCandyMachine extends string,
  TAccountAuthorityPda extends string,
  TAccountAuthority extends string,
  TAccountPayer extends string,
  TAccountCollectionMetadata extends string,
  TAccountCollectionMint extends string,
  TAccountCollectionMasterEdition extends string,
  TAccountCollectionUpdateAuthority extends string,
  TAccountCollectionAuthorityRecord extends string,
  TAccountTokenMetadataProgram extends string,
  TAccountSystemProgram extends string
> = {
  candyMachine: Address<TAccountCandyMachine>;
  authorityPda: Address<TAccountAuthorityPda>;
  authority?: Address<TAccountAuthority>;
  payer?: Address<TAccountPayer>;
  collectionMetadata: Address<TAccountCollectionMetadata>;
  collectionMint: Address<TAccountCollectionMint>;
  collectionMasterEdition: Address<TAccountCollectionMasterEdition>;
  collectionUpdateAuthority: Address<TAccountCollectionUpdateAuthority>;
  collectionAuthorityRecord: Address<TAccountCollectionAuthorityRecord>;
  tokenMetadataProgram?: Address<TAccountTokenMetadataProgram>;
  systemProgram?: Address<TAccountSystemProgram>;
  data: InitializeInstructionDataArgs['data'];
};

// Input.
export type InitializeInputWithSigners<
  TAccountCandyMachine extends string,
  TAccountAuthorityPda extends string,
  TAccountAuthority extends string,
  TAccountPayer extends string,
  TAccountCollectionMetadata extends string,
  TAccountCollectionMint extends string,
  TAccountCollectionMasterEdition extends string,
  TAccountCollectionUpdateAuthority extends string,
  TAccountCollectionAuthorityRecord extends string,
  TAccountTokenMetadataProgram extends string,
  TAccountSystemProgram extends string
> = {
  candyMachine: Address<TAccountCandyMachine>;
  authorityPda: Address<TAccountAuthorityPda>;
  authority?: Address<TAccountAuthority>;
  payer?: TransactionSigner<TAccountPayer>;
  collectionMetadata: Address<TAccountCollectionMetadata>;
  collectionMint: Address<TAccountCollectionMint>;
  collectionMasterEdition: Address<TAccountCollectionMasterEdition>;
  collectionUpdateAuthority: TransactionSigner<TAccountCollectionUpdateAuthority>;
  collectionAuthorityRecord: Address<TAccountCollectionAuthorityRecord>;
  tokenMetadataProgram?: Address<TAccountTokenMetadataProgram>;
  systemProgram?: Address<TAccountSystemProgram>;
  data: InitializeInstructionDataArgs['data'];
};

// Input.
export type InitializeAsyncInput<
  TAccountCandyMachine extends string,
  TAccountAuthorityPda extends string,
  TAccountAuthority extends string,
  TAccountPayer extends string,
  TAccountCollectionMetadata extends string,
  TAccountCollectionMint extends string,
  TAccountCollectionMasterEdition extends string,
  TAccountCollectionUpdateAuthority extends string,
  TAccountCollectionAuthorityRecord extends string,
  TAccountTokenMetadataProgram extends string,
  TAccountSystemProgram extends string
> = {
  candyMachine: Address<TAccountCandyMachine>;
  authorityPda: Address<TAccountAuthorityPda>;
  authority?: Address<TAccountAuthority>;
  payer?: Address<TAccountPayer>;
  collectionMetadata: Address<TAccountCollectionMetadata>;
  collectionMint: Address<TAccountCollectionMint>;
  collectionMasterEdition: Address<TAccountCollectionMasterEdition>;
  collectionUpdateAuthority: Address<TAccountCollectionUpdateAuthority>;
  collectionAuthorityRecord: Address<TAccountCollectionAuthorityRecord>;
  tokenMetadataProgram?: Address<TAccountTokenMetadataProgram>;
  systemProgram?: Address<TAccountSystemProgram>;
  data: InitializeInstructionDataArgs['data'];
};

// Input.
export type InitializeAsyncInputWithSigners<
  TAccountCandyMachine extends string,
  TAccountAuthorityPda extends string,
  TAccountAuthority extends string,
  TAccountPayer extends string,
  TAccountCollectionMetadata extends string,
  TAccountCollectionMint extends string,
  TAccountCollectionMasterEdition extends string,
  TAccountCollectionUpdateAuthority extends string,
  TAccountCollectionAuthorityRecord extends string,
  TAccountTokenMetadataProgram extends string,
  TAccountSystemProgram extends string
> = {
  candyMachine: Address<TAccountCandyMachine>;
  authorityPda: Address<TAccountAuthorityPda>;
  authority?: Address<TAccountAuthority>;
  payer?: TransactionSigner<TAccountPayer>;
  collectionMetadata: Address<TAccountCollectionMetadata>;
  collectionMint: Address<TAccountCollectionMint>;
  collectionMasterEdition: Address<TAccountCollectionMasterEdition>;
  collectionUpdateAuthority: TransactionSigner<TAccountCollectionUpdateAuthority>;
  collectionAuthorityRecord: Address<TAccountCollectionAuthorityRecord>;
  tokenMetadataProgram?: Address<TAccountTokenMetadataProgram>;
  systemProgram?: Address<TAccountSystemProgram>;
  data: InitializeInstructionDataArgs['data'];
};

export async function getInitializeInstructionAsync<
  TAccountCandyMachine extends string,
  TAccountAuthorityPda extends string,
  TAccountAuthority extends string,
  TAccountPayer extends string,
  TAccountCollectionMetadata extends string,
  TAccountCollectionMint extends string,
  TAccountCollectionMasterEdition extends string,
  TAccountCollectionUpdateAuthority extends string,
  TAccountCollectionAuthorityRecord extends string,
  TAccountTokenMetadataProgram extends string,
  TAccountSystemProgram extends string,
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: InitializeAsyncInputWithSigners<
    TAccountCandyMachine,
    TAccountAuthorityPda,
    TAccountAuthority,
    TAccountPayer,
    TAccountCollectionMetadata,
    TAccountCollectionMint,
    TAccountCollectionMasterEdition,
    TAccountCollectionUpdateAuthority,
    TAccountCollectionAuthorityRecord,
    TAccountTokenMetadataProgram,
    TAccountSystemProgram
  >
): Promise<
  InitializeInstructionWithSigners<
    TProgram,
    TAccountCandyMachine,
    TAccountAuthorityPda,
    TAccountAuthority,
    ReadonlySignerAccount<TAccountPayer> & IAccountSignerMeta<TAccountPayer>,
    TAccountCollectionMetadata,
    TAccountCollectionMint,
    TAccountCollectionMasterEdition,
    WritableSignerAccount<TAccountCollectionUpdateAuthority> &
      IAccountSignerMeta<TAccountCollectionUpdateAuthority>,
    TAccountCollectionAuthorityRecord,
    TAccountTokenMetadataProgram,
    TAccountSystemProgram
  >
>;
export async function getInitializeInstructionAsync<
  TAccountCandyMachine extends string,
  TAccountAuthorityPda extends string,
  TAccountAuthority extends string,
  TAccountPayer extends string,
  TAccountCollectionMetadata extends string,
  TAccountCollectionMint extends string,
  TAccountCollectionMasterEdition extends string,
  TAccountCollectionUpdateAuthority extends string,
  TAccountCollectionAuthorityRecord extends string,
  TAccountTokenMetadataProgram extends string,
  TAccountSystemProgram extends string,
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: InitializeAsyncInput<
    TAccountCandyMachine,
    TAccountAuthorityPda,
    TAccountAuthority,
    TAccountPayer,
    TAccountCollectionMetadata,
    TAccountCollectionMint,
    TAccountCollectionMasterEdition,
    TAccountCollectionUpdateAuthority,
    TAccountCollectionAuthorityRecord,
    TAccountTokenMetadataProgram,
    TAccountSystemProgram
  >
): Promise<
  InitializeInstruction<
    TProgram,
    TAccountCandyMachine,
    TAccountAuthorityPda,
    TAccountAuthority,
    ReadonlySignerAccount<TAccountPayer> & IAccountSignerMeta<TAccountPayer>,
    TAccountCollectionMetadata,
    TAccountCollectionMint,
    TAccountCollectionMasterEdition,
    WritableSignerAccount<TAccountCollectionUpdateAuthority> &
      IAccountSignerMeta<TAccountCollectionUpdateAuthority>,
    TAccountCollectionAuthorityRecord,
    TAccountTokenMetadataProgram,
    TAccountSystemProgram
  >
>;
export async function getInitializeInstructionAsync<
  TAccountCandyMachine extends string,
  TAccountAuthorityPda extends string,
  TAccountAuthority extends string,
  TAccountPayer extends string,
  TAccountCollectionMetadata extends string,
  TAccountCollectionMint extends string,
  TAccountCollectionMasterEdition extends string,
  TAccountCollectionUpdateAuthority extends string,
  TAccountCollectionAuthorityRecord extends string,
  TAccountTokenMetadataProgram extends string,
  TAccountSystemProgram extends string,
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
>(
  input: InitializeAsyncInputWithSigners<
    TAccountCandyMachine,
    TAccountAuthorityPda,
    TAccountAuthority,
    TAccountPayer,
    TAccountCollectionMetadata,
    TAccountCollectionMint,
    TAccountCollectionMasterEdition,
    TAccountCollectionUpdateAuthority,
    TAccountCollectionAuthorityRecord,
    TAccountTokenMetadataProgram,
    TAccountSystemProgram
  >
): Promise<
  InitializeInstructionWithSigners<
    TProgram,
    TAccountCandyMachine,
    TAccountAuthorityPda,
    TAccountAuthority,
    ReadonlySignerAccount<TAccountPayer> & IAccountSignerMeta<TAccountPayer>,
    TAccountCollectionMetadata,
    TAccountCollectionMint,
    TAccountCollectionMasterEdition,
    WritableSignerAccount<TAccountCollectionUpdateAuthority> &
      IAccountSignerMeta<TAccountCollectionUpdateAuthority>,
    TAccountCollectionAuthorityRecord,
    TAccountTokenMetadataProgram,
    TAccountSystemProgram
  >
>;
export async function getInitializeInstructionAsync<
  TAccountCandyMachine extends string,
  TAccountAuthorityPda extends string,
  TAccountAuthority extends string,
  TAccountPayer extends string,
  TAccountCollectionMetadata extends string,
  TAccountCollectionMint extends string,
  TAccountCollectionMasterEdition extends string,
  TAccountCollectionUpdateAuthority extends string,
  TAccountCollectionAuthorityRecord extends string,
  TAccountTokenMetadataProgram extends string,
  TAccountSystemProgram extends string,
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
>(
  input: InitializeAsyncInput<
    TAccountCandyMachine,
    TAccountAuthorityPda,
    TAccountAuthority,
    TAccountPayer,
    TAccountCollectionMetadata,
    TAccountCollectionMint,
    TAccountCollectionMasterEdition,
    TAccountCollectionUpdateAuthority,
    TAccountCollectionAuthorityRecord,
    TAccountTokenMetadataProgram,
    TAccountSystemProgram
  >
): Promise<
  InitializeInstruction<
    TProgram,
    TAccountCandyMachine,
    TAccountAuthorityPda,
    TAccountAuthority,
    ReadonlySignerAccount<TAccountPayer> & IAccountSignerMeta<TAccountPayer>,
    TAccountCollectionMetadata,
    TAccountCollectionMint,
    TAccountCollectionMasterEdition,
    WritableSignerAccount<TAccountCollectionUpdateAuthority> &
      IAccountSignerMeta<TAccountCollectionUpdateAuthority>,
    TAccountCollectionAuthorityRecord,
    TAccountTokenMetadataProgram,
    TAccountSystemProgram
  >
>;
export async function getInitializeInstructionAsync<
  TAccountCandyMachine extends string,
  TAccountAuthorityPda extends string,
  TAccountAuthority extends string,
  TAccountPayer extends string,
  TAccountCollectionMetadata extends string,
  TAccountCollectionMint extends string,
  TAccountCollectionMasterEdition extends string,
  TAccountCollectionUpdateAuthority extends string,
  TAccountCollectionAuthorityRecord extends string,
  TAccountTokenMetadataProgram extends string,
  TAccountSystemProgram extends string,
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | InitializeAsyncInput<
        TAccountCandyMachine,
        TAccountAuthorityPda,
        TAccountAuthority,
        TAccountPayer,
        TAccountCollectionMetadata,
        TAccountCollectionMint,
        TAccountCollectionMasterEdition,
        TAccountCollectionUpdateAuthority,
        TAccountCollectionAuthorityRecord,
        TAccountTokenMetadataProgram,
        TAccountSystemProgram
      >,
  rawInput?: InitializeAsyncInput<
    TAccountCandyMachine,
    TAccountAuthorityPda,
    TAccountAuthority,
    TAccountPayer,
    TAccountCollectionMetadata,
    TAccountCollectionMint,
    TAccountCollectionMasterEdition,
    TAccountCollectionUpdateAuthority,
    TAccountCollectionAuthorityRecord,
    TAccountTokenMetadataProgram,
    TAccountSystemProgram
  >
): Promise<IInstruction> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawContext) as Pick<
    Context,
    'getProgramAddress'
  >;
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as InitializeAsyncInput<
    TAccountCandyMachine,
    TAccountAuthorityPda,
    TAccountAuthority,
    TAccountPayer,
    TAccountCollectionMetadata,
    TAccountCollectionMint,
    TAccountCollectionMasterEdition,
    TAccountCollectionUpdateAuthority,
    TAccountCollectionAuthorityRecord,
    TAccountTokenMetadataProgram,
    TAccountSystemProgram
  >;

  // Program address.
  const defaultProgramAddress =
    'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR' as Address<'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'>;
  const programAddress = (
    context.getProgramAddress
      ? await context.getProgramAddress({
          name: 'mplCandyMachineCore',
          address: defaultProgramAddress,
        })
      : defaultProgramAddress
  ) as Address<TProgram>;

  // Original accounts.
  type AccountMetas = Parameters<
    typeof getInitializeInstructionRaw<
      TProgram,
      TAccountCandyMachine,
      TAccountAuthorityPda,
      TAccountAuthority,
      TAccountPayer,
      TAccountCollectionMetadata,
      TAccountCollectionMint,
      TAccountCollectionMasterEdition,
      TAccountCollectionUpdateAuthority,
      TAccountCollectionAuthorityRecord,
      TAccountTokenMetadataProgram,
      TAccountSystemProgram
    >
  >[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    candyMachine: { value: input.candyMachine ?? null, isWritable: true },
    authorityPda: { value: input.authorityPda ?? null, isWritable: true },
    authority: { value: input.authority ?? null, isWritable: false },
    payer: { value: input.payer ?? null, isWritable: false },
    collectionMetadata: {
      value: input.collectionMetadata ?? null,
      isWritable: false,
    },
    collectionMint: { value: input.collectionMint ?? null, isWritable: false },
    collectionMasterEdition: {
      value: input.collectionMasterEdition ?? null,
      isWritable: false,
    },
    collectionUpdateAuthority: {
      value: input.collectionUpdateAuthority ?? null,
      isWritable: true,
    },
    collectionAuthorityRecord: {
      value: input.collectionAuthorityRecord ?? null,
      isWritable: true,
    },
    tokenMetadataProgram: {
      value: input.tokenMetadataProgram ?? null,
      isWritable: false,
    },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
  };

  // Original args.
  const args = { ...input };

  // Resolve default values.
  if (!accounts.tokenMetadataProgram.value) {
    accounts.tokenMetadataProgram.value = await getProgramAddress(
      context,
      'mplTokenMetadata',
      'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
    );
    accounts.tokenMetadataProgram.isWritable = false;
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = await getProgramAddress(
      context,
      'splSystem',
      '11111111111111111111111111111111'
    );
    accounts.systemProgram.isWritable = false;
  }

  // Get account metas and signers.
  const accountMetas = getAccountMetasWithSigners(
    accounts,
    'programId',
    programAddress
  );

  // Remaining accounts.
  const remainingAccounts: IAccountMeta[] = [];

  // Bytes created on chain.
  const bytesCreatedOnChain = 0;

  return Object.freeze({
    ...getInitializeInstructionRaw(
      accountMetas as Record<keyof AccountMetas, IAccountMeta>,
      args as InitializeInstructionDataArgs,
      programAddress,
      remainingAccounts
    ),
    bytesCreatedOnChain,
  });
}
