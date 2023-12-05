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
import {
  getU32Decoder,
  getU32Encoder,
  getU64Decoder,
  getU64Encoder,
  getU8Decoder,
  getU8Encoder,
} from '@solana/codecs-numbers';
import {
  AccountRole,
  IAccountMeta,
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  ReadonlySignerAccount,
  WritableAccount,
} from '@solana/instructions';
import { IAccountSignerMeta, TransactionSigner } from '@solana/signers';
import {
  Context,
  ResolvedAccount,
  accountMetaWithDefault,
  getAccountMetasWithSigners,
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
  TAccountCandyMachine extends string | IAccountMeta<string> = string,
  TAccountAuthority extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountCandyMachine extends string
        ? WritableAccount<TAccountCandyMachine>
        : TAccountCandyMachine,
      TAccountAuthority extends string
        ? ReadonlySignerAccount<TAccountAuthority>
        : TAccountAuthority,
      ...TRemainingAccounts
    ]
  >;

// Output.
export type AddConfigLinesInstructionWithSigners<
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountCandyMachine extends string | IAccountMeta<string> = string,
  TAccountAuthority extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountCandyMachine extends string
        ? WritableAccount<TAccountCandyMachine>
        : TAccountCandyMachine,
      TAccountAuthority extends string
        ? ReadonlySignerAccount<TAccountAuthority> &
            IAccountSignerMeta<TAccountAuthority>
        : TAccountAuthority,
      ...TRemainingAccounts
    ]
  >;

export type AddConfigLinesInstructionData = {
  discriminator: Array<number>;
  index: number;
  configLines: Array<ConfigLine>;
  /** More dummy lines. */
  moreLines: Array<ConfigLine>;
};

export type AddConfigLinesInstructionDataArgs = {
  index: number;
  configLines: Array<ConfigLineArgs>;
  /** More dummy lines. */
  moreLines: Array<ConfigLineArgs>;
};

export function getAddConfigLinesInstructionDataEncoder() {
  return mapEncoder(
    getStructEncoder<{
      discriminator: Array<number>;
      index: number;
      configLines: Array<ConfigLineArgs>;
      /** More dummy lines. */
      moreLines: Array<ConfigLineArgs>;
    }>([
      ['discriminator', getArrayEncoder(getU8Encoder(), { size: 8 })],
      ['index', getU32Encoder()],
      ['configLines', getArrayEncoder(getConfigLineEncoder())],
      [
        'moreLines',
        getArrayEncoder(getConfigLineEncoder(), { size: getU64Encoder() }),
      ],
    ]),
    (value) => ({
      ...value,
      discriminator: [223, 50, 224, 227, 151, 8, 115, 106],
    })
  ) satisfies Encoder<AddConfigLinesInstructionDataArgs>;
}

export function getAddConfigLinesInstructionDataDecoder() {
  return getStructDecoder<AddConfigLinesInstructionData>([
    ['discriminator', getArrayDecoder(getU8Decoder(), { size: 8 })],
    ['index', getU32Decoder()],
    ['configLines', getArrayDecoder(getConfigLineDecoder())],
    [
      'moreLines',
      getArrayDecoder(getConfigLineDecoder(), { size: getU64Decoder() }),
    ],
  ]) satisfies Decoder<AddConfigLinesInstructionData>;
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

function getAddConfigLinesInstructionRaw<
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  TAccountCandyMachine extends string | IAccountMeta<string> = string,
  TAccountAuthority extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
>(
  accounts: {
    candyMachine: TAccountCandyMachine extends string
      ? Address<TAccountCandyMachine>
      : TAccountCandyMachine;
    authority: TAccountAuthority extends string
      ? Address<TAccountAuthority>
      : TAccountAuthority;
  },
  args: AddConfigLinesInstructionDataArgs,
  programAddress: Address<TProgram> = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR' as Address<TProgram>,
  remainingAccounts?: TRemainingAccounts
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.candyMachine, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.authority, AccountRole.READONLY_SIGNER),
      ...(remainingAccounts ?? []),
    ],
    data: getAddConfigLinesInstructionDataEncoder().encode(args),
    programAddress,
  } as AddConfigLinesInstruction<
    TProgram,
    TAccountCandyMachine,
    TAccountAuthority,
    TRemainingAccounts
  >;
}

// Input.
export type AddConfigLinesInput<
  TAccountCandyMachine extends string,
  TAccountAuthority extends string
> = {
  candyMachine: Address<TAccountCandyMachine>;
  authority?: Address<TAccountAuthority>;
  index: AddConfigLinesInstructionDataArgs['index'];
  configLines: AddConfigLinesInstructionDataArgs['configLines'];
  moreLines: AddConfigLinesInstructionDataArgs['moreLines'];
};

// Input.
export type AddConfigLinesInputWithSigners<
  TAccountCandyMachine extends string,
  TAccountAuthority extends string
> = {
  candyMachine: Address<TAccountCandyMachine>;
  authority?: TransactionSigner<TAccountAuthority>;
  index: AddConfigLinesInstructionDataArgs['index'];
  configLines: AddConfigLinesInstructionDataArgs['configLines'];
  moreLines: AddConfigLinesInstructionDataArgs['moreLines'];
};

// Input.
export type AddConfigLinesAsyncInput<
  TAccountCandyMachine extends string,
  TAccountAuthority extends string
> = {
  candyMachine: Address<TAccountCandyMachine>;
  authority?: Address<TAccountAuthority>;
  index: AddConfigLinesInstructionDataArgs['index'];
  configLines: AddConfigLinesInstructionDataArgs['configLines'];
  moreLines: AddConfigLinesInstructionDataArgs['moreLines'];
};

// Input.
export type AddConfigLinesAsyncInputWithSigners<
  TAccountCandyMachine extends string,
  TAccountAuthority extends string
> = {
  candyMachine: Address<TAccountCandyMachine>;
  authority?: TransactionSigner<TAccountAuthority>;
  index: AddConfigLinesInstructionDataArgs['index'];
  configLines: AddConfigLinesInstructionDataArgs['configLines'];
  moreLines: AddConfigLinesInstructionDataArgs['moreLines'];
};

export async function getAddConfigLinesInstructionAsync<
  TAccountCandyMachine extends string,
  TAccountAuthority extends string,
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: AddConfigLinesAsyncInputWithSigners<
    TAccountCandyMachine,
    TAccountAuthority
  >
): Promise<
  AddConfigLinesInstructionWithSigners<
    TProgram,
    TAccountCandyMachine,
    ReadonlySignerAccount<TAccountAuthority> &
      IAccountSignerMeta<TAccountAuthority>
  >
>;
export async function getAddConfigLinesInstructionAsync<
  TAccountCandyMachine extends string,
  TAccountAuthority extends string,
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: AddConfigLinesAsyncInput<TAccountCandyMachine, TAccountAuthority>
): Promise<
  AddConfigLinesInstruction<
    TProgram,
    TAccountCandyMachine,
    ReadonlySignerAccount<TAccountAuthority> &
      IAccountSignerMeta<TAccountAuthority>
  >
>;
export async function getAddConfigLinesInstructionAsync<
  TAccountCandyMachine extends string,
  TAccountAuthority extends string,
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
>(
  input: AddConfigLinesAsyncInputWithSigners<
    TAccountCandyMachine,
    TAccountAuthority
  >
): Promise<
  AddConfigLinesInstructionWithSigners<
    TProgram,
    TAccountCandyMachine,
    ReadonlySignerAccount<TAccountAuthority> &
      IAccountSignerMeta<TAccountAuthority>
  >
>;
export async function getAddConfigLinesInstructionAsync<
  TAccountCandyMachine extends string,
  TAccountAuthority extends string,
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
>(
  input: AddConfigLinesAsyncInput<TAccountCandyMachine, TAccountAuthority>
): Promise<
  AddConfigLinesInstruction<
    TProgram,
    TAccountCandyMachine,
    ReadonlySignerAccount<TAccountAuthority> &
      IAccountSignerMeta<TAccountAuthority>
  >
>;
export async function getAddConfigLinesInstructionAsync<
  TAccountCandyMachine extends string,
  TAccountAuthority extends string,
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | AddConfigLinesAsyncInput<TAccountCandyMachine, TAccountAuthority>,
  rawInput?: AddConfigLinesAsyncInput<TAccountCandyMachine, TAccountAuthority>
): Promise<IInstruction> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawContext) as Pick<
    Context,
    'getProgramAddress'
  >;
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as AddConfigLinesAsyncInput<TAccountCandyMachine, TAccountAuthority>;

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
    typeof getAddConfigLinesInstructionRaw<
      TProgram,
      TAccountCandyMachine,
      TAccountAuthority
    >
  >[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    candyMachine: { value: input.candyMachine ?? null, isWritable: true },
    authority: { value: input.authority ?? null, isWritable: false },
  };

  // Original args.
  const args = { ...input };

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
    ...getAddConfigLinesInstructionRaw(
      accountMetas as Record<keyof AccountMetas, IAccountMeta>,
      args as AddConfigLinesInstructionDataArgs,
      programAddress,
      remainingAccounts
    ),
    bytesCreatedOnChain,
  });
}
