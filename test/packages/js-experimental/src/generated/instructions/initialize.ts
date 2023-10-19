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
  IAccountMeta,
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
  CustomGeneratedInstruction,
  ResolvedAccount,
  Signer,
  WrappedInstruction,
  accountMetaWithDefault,
  getAccountMetasAndSigners,
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
    | IAccountMeta<string> = '11111111111111111111111111111111'
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
        : TAccountSystemProgram
    ]
  >;

export type InitializeInstructionData = {
  discriminator: Array<number>;
  data: CandyMachineData;
};

export type InitializeInstructionDataArgs = { data: CandyMachineDataArgs };

export function getInitializeInstructionDataEncoder(): Encoder<InitializeInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<InitializeInstructionData>(
      [
        ['discriminator', getArrayEncoder(getU8Encoder(), { size: 8 })],
        ['data', getCandyMachineDataEncoder()],
      ],
      { description: 'InitializeInstructionData' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      } as InitializeInstructionData)
  ) as Encoder<InitializeInstructionDataArgs>;
}

export function getInitializeInstructionDataDecoder(): Decoder<InitializeInstructionData> {
  return getStructDecoder<InitializeInstructionData>(
    [
      ['discriminator', getArrayDecoder(getU8Decoder(), { size: 8 })],
      ['data', getCandyMachineDataDecoder()],
    ],
    { description: 'InitializeInstructionData' }
  ) as Decoder<InitializeInstructionData>;
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

export function initializeInstruction<
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
    | IAccountMeta<string> = '11111111111111111111111111111111'
>(
  accounts: {
    candyMachine: TAccountCandyMachine extends string
      ? Base58EncodedAddress<TAccountCandyMachine>
      : TAccountCandyMachine;
    authorityPda: TAccountAuthorityPda extends string
      ? Base58EncodedAddress<TAccountAuthorityPda>
      : TAccountAuthorityPda;
    authority: TAccountAuthority extends string
      ? Base58EncodedAddress<TAccountAuthority>
      : TAccountAuthority;
    payer: TAccountPayer extends string
      ? Base58EncodedAddress<TAccountPayer>
      : TAccountPayer;
    collectionMetadata: TAccountCollectionMetadata extends string
      ? Base58EncodedAddress<TAccountCollectionMetadata>
      : TAccountCollectionMetadata;
    collectionMint: TAccountCollectionMint extends string
      ? Base58EncodedAddress<TAccountCollectionMint>
      : TAccountCollectionMint;
    collectionMasterEdition: TAccountCollectionMasterEdition extends string
      ? Base58EncodedAddress<TAccountCollectionMasterEdition>
      : TAccountCollectionMasterEdition;
    collectionUpdateAuthority: TAccountCollectionUpdateAuthority extends string
      ? Base58EncodedAddress<TAccountCollectionUpdateAuthority>
      : TAccountCollectionUpdateAuthority;
    collectionAuthorityRecord: TAccountCollectionAuthorityRecord extends string
      ? Base58EncodedAddress<TAccountCollectionAuthorityRecord>
      : TAccountCollectionAuthorityRecord;
    tokenMetadataProgram?: TAccountTokenMetadataProgram extends string
      ? Base58EncodedAddress<TAccountTokenMetadataProgram>
      : TAccountTokenMetadataProgram;
    systemProgram?: TAccountSystemProgram extends string
      ? Base58EncodedAddress<TAccountSystemProgram>
      : TAccountSystemProgram;
  },
  args: InitializeInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR' as Base58EncodedAddress<TProgram>
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
            'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
      accountMetaWithDefault(
        accounts.systemProgram ?? {
          address:
            '11111111111111111111111111111111' as Base58EncodedAddress<'11111111111111111111111111111111'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
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
    TAccountSystemProgram
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
  candyMachine: Base58EncodedAddress<TAccountCandyMachine>;
  authorityPda: Base58EncodedAddress<TAccountAuthorityPda>;
  authority?: Base58EncodedAddress<TAccountAuthority>;
  payer?: Signer<TAccountPayer>;
  collectionMetadata: Base58EncodedAddress<TAccountCollectionMetadata>;
  collectionMint: Base58EncodedAddress<TAccountCollectionMint>;
  collectionMasterEdition: Base58EncodedAddress<TAccountCollectionMasterEdition>;
  collectionUpdateAuthority: Signer<TAccountCollectionUpdateAuthority>;
  collectionAuthorityRecord: Base58EncodedAddress<TAccountCollectionAuthorityRecord>;
  tokenMetadataProgram?: Base58EncodedAddress<TAccountTokenMetadataProgram>;
  systemProgram?: Base58EncodedAddress<TAccountSystemProgram>;
  data: InitializeInstructionDataArgs['data'];
};

export async function initialize<
  TReturn,
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
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      InitializeInstruction<
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
      >,
      TReturn
    >,
  input: InitializeInput<
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
): Promise<TReturn>;
export async function initialize<
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
  input: InitializeInput<
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
  WrappedInstruction<
    InitializeInstruction<
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
  >
>;
export async function initialize<
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
  input: InitializeInput<
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
  WrappedInstruction<
    InitializeInstruction<
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
  >
>;
export async function initialize<
  TReturn,
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
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>)
    | InitializeInput<
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
  rawInput?: InitializeInput<
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
): Promise<TReturn | WrappedInstruction<IInstruction>> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as InitializeInput<
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
    'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR' as Base58EncodedAddress<'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'>;
  const programAddress = (
    context.getProgramAddress
      ? await context.getProgramAddress({
          name: 'mplCandyMachineCore',
          address: defaultProgramAddress,
        })
      : defaultProgramAddress
  ) as Base58EncodedAddress<TProgram>;

  // Original accounts.
  type AccountMetas = Parameters<typeof initializeInstruction>[0];
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
  const [accountMetas, signers] = getAccountMetasAndSigners(
    accounts,
    'programId',
    programAddress
  );

  // Remaining accounts.
  // TODO

  // Bytes created on chain.
  // TODO

  return {
    instruction: initializeInstruction(
      accountMetas as AccountMetas,
      args,
      programAddress
    ) as InitializeInstruction<
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
    >,
    signers,
    bytesCreatedOnChain: 0,
  };
}
