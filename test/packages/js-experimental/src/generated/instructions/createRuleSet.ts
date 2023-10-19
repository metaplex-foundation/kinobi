/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Base58EncodedAddress, ProgramDerivedAddress } from '@solana/addresses';
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
  IAccountMeta,
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  ReadonlyAccount,
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
  expectProgramDerivedAddress,
  getAccountMetasAndSigners,
  getProgramAddress,
} from '../shared';
import {
  TaCreateArgs,
  TaCreateArgsArgs,
  getTaCreateArgsDecoder,
  getTaCreateArgsEncoder,
} from '../types';

// Output.
export type CreateRuleSetInstruction<
  TProgram extends string = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg',
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountRuleSetPda extends string | IAccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111'
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountPayer extends string
        ? WritableSignerAccount<TAccountPayer>
        : TAccountPayer,
      TAccountRuleSetPda extends string
        ? WritableAccount<TAccountRuleSetPda>
        : TAccountRuleSetPda,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram
    ]
  >;

export type CreateRuleSetInstructionData = {
  discriminator: number;
  createArgs: TaCreateArgs;
  ruleSetBump: number;
};

export type CreateRuleSetInstructionDataArgs = {
  createArgs: TaCreateArgsArgs;
  ruleSetBump: number;
};

export function getCreateRuleSetInstructionDataEncoder(): Encoder<CreateRuleSetInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<CreateRuleSetInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['createArgs', getTaCreateArgsEncoder()],
        ['ruleSetBump', getU8Encoder()],
      ],
      { description: 'CreateRuleSetInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 0 } as CreateRuleSetInstructionData)
  ) as Encoder<CreateRuleSetInstructionDataArgs>;
}

export function getCreateRuleSetInstructionDataDecoder(): Decoder<CreateRuleSetInstructionData> {
  return getStructDecoder<CreateRuleSetInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['createArgs', getTaCreateArgsDecoder()],
      ['ruleSetBump', getU8Decoder()],
    ],
    { description: 'CreateRuleSetInstructionData' }
  ) as Decoder<CreateRuleSetInstructionData>;
}

export function getCreateRuleSetInstructionDataCodec(): Codec<
  CreateRuleSetInstructionDataArgs,
  CreateRuleSetInstructionData
> {
  return combineCodec(
    getCreateRuleSetInstructionDataEncoder(),
    getCreateRuleSetInstructionDataDecoder()
  );
}

export function createRuleSetInstruction<
  TProgram extends string = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg',
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountRuleSetPda extends string | IAccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111'
>(
  accounts: {
    payer: TAccountPayer extends string
      ? Base58EncodedAddress<TAccountPayer>
      : TAccountPayer;
    ruleSetPda: TAccountRuleSetPda extends string
      ? Base58EncodedAddress<TAccountRuleSetPda>
      : TAccountRuleSetPda;
    systemProgram?: TAccountSystemProgram extends string
      ? Base58EncodedAddress<TAccountSystemProgram>
      : TAccountSystemProgram;
  },
  args: CreateRuleSetInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.payer, AccountRole.WRITABLE_SIGNER),
      accountMetaWithDefault(accounts.ruleSetPda, AccountRole.WRITABLE),
      accountMetaWithDefault(
        accounts.systemProgram ?? {
          address:
            '11111111111111111111111111111111' as Base58EncodedAddress<'11111111111111111111111111111111'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
    ],
    data: getCreateRuleSetInstructionDataEncoder().encode(args),
    programAddress,
  } as CreateRuleSetInstruction<
    TProgram,
    TAccountPayer,
    TAccountRuleSetPda,
    TAccountSystemProgram
  >;
}

// Input.
export type CreateRuleSetInput<
  TAccountPayer extends string,
  TAccountRuleSetPda extends string,
  TAccountSystemProgram extends string
> = {
  /** Payer and creator of the RuleSet */
  payer?: Signer<TAccountPayer>;
  /** The PDA account where the RuleSet is stored */
  ruleSetPda: ProgramDerivedAddress<TAccountRuleSetPda>;
  /** System program */
  systemProgram?: Base58EncodedAddress<TAccountSystemProgram>;
  createArgs: CreateRuleSetInstructionDataArgs['createArgs'];
  ruleSetBump?: CreateRuleSetInstructionDataArgs['ruleSetBump'];
};

export async function createRuleSet<
  TReturn,
  TAccountPayer extends string,
  TAccountRuleSetPda extends string,
  TAccountSystemProgram extends string,
  TProgram extends string = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg'
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      CreateRuleSetInstruction<
        TProgram,
        TAccountPayer,
        TAccountRuleSetPda,
        TAccountSystemProgram
      >,
      TReturn
    >,
  input: CreateRuleSetInput<
    TAccountPayer,
    TAccountRuleSetPda,
    TAccountSystemProgram
  >
): Promise<TReturn>;
export async function createRuleSet<
  TAccountPayer extends string,
  TAccountRuleSetPda extends string,
  TAccountSystemProgram extends string,
  TProgram extends string = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: CreateRuleSetInput<
    TAccountPayer,
    TAccountRuleSetPda,
    TAccountSystemProgram
  >
): Promise<
  WrappedInstruction<
    CreateRuleSetInstruction<
      TProgram,
      TAccountPayer,
      TAccountRuleSetPda,
      TAccountSystemProgram
    >
  >
>;
export async function createRuleSet<
  TAccountPayer extends string,
  TAccountRuleSetPda extends string,
  TAccountSystemProgram extends string,
  TProgram extends string = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg'
>(
  input: CreateRuleSetInput<
    TAccountPayer,
    TAccountRuleSetPda,
    TAccountSystemProgram
  >
): Promise<
  WrappedInstruction<
    CreateRuleSetInstruction<
      TProgram,
      TAccountPayer,
      TAccountRuleSetPda,
      TAccountSystemProgram
    >
  >
>;
export async function createRuleSet<
  TReturn,
  TAccountPayer extends string,
  TAccountRuleSetPda extends string,
  TAccountSystemProgram extends string,
  TProgram extends string = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>)
    | CreateRuleSetInput<
        TAccountPayer,
        TAccountRuleSetPda,
        TAccountSystemProgram
      >,
  rawInput?: CreateRuleSetInput<
    TAccountPayer,
    TAccountRuleSetPda,
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
  ) as CreateRuleSetInput<
    TAccountPayer,
    TAccountRuleSetPda,
    TAccountSystemProgram
  >;

  // Program address.
  const defaultProgramAddress =
    'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg' as Base58EncodedAddress<'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg'>;
  const programAddress = (
    context.getProgramAddress
      ? await context.getProgramAddress({
          name: 'mplTokenAuthRules',
          address: defaultProgramAddress,
        })
      : defaultProgramAddress
  ) as Base58EncodedAddress<TProgram>;

  // Original accounts.
  type AccountMetas = Parameters<typeof createRuleSetInstruction>[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    payer: { value: input.payer ?? null, isWritable: true },
    ruleSetPda: { value: input.ruleSetPda ?? null, isWritable: true },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
  };

  // Original args.
  const args = { ...input };

  // Resolve default values.
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = await getProgramAddress(
      context,
      'splSystem',
      '11111111111111111111111111111111'
    );
    accounts.systemProgram.isWritable = false;
  }
  if (!args.ruleSetBump) {
    args.ruleSetBump = expectProgramDerivedAddress(
      accounts.ruleSetPda.value
    )[1];
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
    instruction: createRuleSetInstruction(
      accountMetas as AccountMetas,
      args,
      programAddress
    ) as CreateRuleSetInstruction<
      TProgram,
      TAccountPayer,
      TAccountRuleSetPda,
      TAccountSystemProgram
    >,
    signers,
    bytesCreatedOnChain: 0,
  };
}
