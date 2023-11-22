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
import {
  IAccountSignerMeta,
  IInstructionWithSigners,
  TransactionSigner,
} from '@solana/signers';
import {
  Context,
  CustomGeneratedInstruction,
  IInstructionWithBytesCreatedOnChain,
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

export function getAddConfigLinesInstructionDataEncoder(): Encoder<AddConfigLinesInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<{
      discriminator: Array<number>;
      index: number;
      configLines: Array<ConfigLineArgs>;
      /** More dummy lines. */
      moreLines: Array<ConfigLineArgs>;
    }>(
      [
        ['discriminator', getArrayEncoder(getU8Encoder(), { size: 8 })],
        ['index', getU32Encoder()],
        ['configLines', getArrayEncoder(getConfigLineEncoder())],
        [
          'moreLines',
          getArrayEncoder(getConfigLineEncoder(), { size: getU64Encoder() }),
        ],
      ],
      { description: 'AddConfigLinesInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [223, 50, 224, 227, 151, 8, 115, 106],
    })
  ) as Encoder<AddConfigLinesInstructionDataArgs>;
}

export function getAddConfigLinesInstructionDataDecoder(): Decoder<AddConfigLinesInstructionData> {
  return getStructDecoder<AddConfigLinesInstructionData>(
    [
      ['discriminator', getArrayDecoder(getU8Decoder(), { size: 8 })],
      ['index', getU32Decoder()],
      ['configLines', getArrayDecoder(getConfigLineDecoder())],
      [
        'moreLines',
        getArrayDecoder(getConfigLineDecoder(), { size: getU64Decoder() }),
      ],
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

export function addConfigLinesInstruction<
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
  authority?: TransactionSigner<TAccountAuthority>;
  index: AddConfigLinesInstructionDataArgs['index'];
  configLines: AddConfigLinesInstructionDataArgs['configLines'];
  moreLines: AddConfigLinesInstructionDataArgs['moreLines'];
};

export async function addConfigLines<
  TReturn,
  TAccountCandyMachine extends string,
  TAccountAuthority extends string,
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      AddConfigLinesInstruction<
        TProgram,
        TAccountCandyMachine,
        ReadonlySignerAccount<TAccountAuthority> &
          IAccountSignerMeta<TAccountAuthority>
      >,
      TReturn
    >,
  input: AddConfigLinesInput<TAccountCandyMachine, TAccountAuthority>
): Promise<TReturn>;
export async function addConfigLines<
  TAccountCandyMachine extends string,
  TAccountAuthority extends string,
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: AddConfigLinesInput<TAccountCandyMachine, TAccountAuthority>
): Promise<
  AddConfigLinesInstruction<
    TProgram,
    TAccountCandyMachine,
    ReadonlySignerAccount<TAccountAuthority> &
      IAccountSignerMeta<TAccountAuthority>
  > &
    IInstructionWithSigners &
    IInstructionWithBytesCreatedOnChain
>;
export async function addConfigLines<
  TAccountCandyMachine extends string,
  TAccountAuthority extends string,
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
>(
  input: AddConfigLinesInput<TAccountCandyMachine, TAccountAuthority>
): Promise<
  AddConfigLinesInstruction<
    TProgram,
    TAccountCandyMachine,
    ReadonlySignerAccount<TAccountAuthority> &
      IAccountSignerMeta<TAccountAuthority>
  > &
    IInstructionWithSigners &
    IInstructionWithBytesCreatedOnChain
>;
export async function addConfigLines<
  TReturn,
  TAccountCandyMachine extends string,
  TAccountAuthority extends string,
  TProgram extends string = 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>)
    | AddConfigLinesInput<TAccountCandyMachine, TAccountAuthority>,
  rawInput?: AddConfigLinesInput<TAccountCandyMachine, TAccountAuthority>
): Promise<
  | TReturn
  | (IInstruction &
      IInstructionWithSigners &
      IInstructionWithBytesCreatedOnChain)
> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawContext) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as AddConfigLinesInput<TAccountCandyMachine, TAccountAuthority>;

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
    typeof addConfigLinesInstruction<
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

  // Instruction.
  const instruction = {
    ...addConfigLinesInstruction(
      accountMetas as Record<keyof AccountMetas, IAccountMeta>,
      args as AddConfigLinesInstructionDataArgs,
      programAddress,
      remainingAccounts
    ),
    bytesCreatedOnChain,
  };

  return 'getGeneratedInstruction' in context && context.getGeneratedInstruction
    ? context.getGeneratedInstruction(instruction)
    : instruction;
}
