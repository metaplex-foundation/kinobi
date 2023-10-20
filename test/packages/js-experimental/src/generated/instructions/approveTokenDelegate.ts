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
import {
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
  ReadonlyAccount,
  ReadonlySignerAccount,
  WritableAccount,
} from '@solana/instructions';
import {
  Context,
  CustomGeneratedInstruction,
  ResolvedAccount,
  Signer,
  WrappedInstruction,
  accountMetaWithDefault,
  getAccountMetasAndSigners,
} from '../shared';

// Output.
export type ApproveTokenDelegateInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSource extends string | IAccountMeta<string> = string,
  TAccountDelegate extends string | IAccountMeta<string> = string,
  TAccountOwner extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountSource extends string
        ? WritableAccount<TAccountSource>
        : TAccountSource,
      TAccountDelegate extends string
        ? ReadonlyAccount<TAccountDelegate>
        : TAccountDelegate,
      TAccountOwner extends string
        ? ReadonlySignerAccount<TAccountOwner>
        : TAccountOwner,
      ...TRemainingAccounts
    ]
  >;

export type ApproveTokenDelegateInstructionData = {
  discriminator: number;
  amount: bigint;
};

export type ApproveTokenDelegateInstructionDataArgs = {
  amount: number | bigint;
};

export function getApproveTokenDelegateInstructionDataEncoder(): Encoder<ApproveTokenDelegateInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<{ discriminator: number; amount: number | bigint }>(
      [
        ['discriminator', getU8Encoder()],
        ['amount', getU64Encoder()],
      ],
      { description: 'ApproveTokenDelegateInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 4 })
  ) as Encoder<ApproveTokenDelegateInstructionDataArgs>;
}

export function getApproveTokenDelegateInstructionDataDecoder(): Decoder<ApproveTokenDelegateInstructionData> {
  return getStructDecoder<ApproveTokenDelegateInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['amount', getU64Decoder()],
    ],
    { description: 'ApproveTokenDelegateInstructionData' }
  ) as Decoder<ApproveTokenDelegateInstructionData>;
}

export function getApproveTokenDelegateInstructionDataCodec(): Codec<
  ApproveTokenDelegateInstructionDataArgs,
  ApproveTokenDelegateInstructionData
> {
  return combineCodec(
    getApproveTokenDelegateInstructionDataEncoder(),
    getApproveTokenDelegateInstructionDataDecoder()
  );
}

export function approveTokenDelegateInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSource extends string | IAccountMeta<string> = string,
  TAccountDelegate extends string | IAccountMeta<string> = string,
  TAccountOwner extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
>(
  accounts: {
    source: TAccountSource extends string
      ? Base58EncodedAddress<TAccountSource>
      : TAccountSource;
    delegate: TAccountDelegate extends string
      ? Base58EncodedAddress<TAccountDelegate>
      : TAccountDelegate;
    owner: TAccountOwner extends string
      ? Base58EncodedAddress<TAccountOwner>
      : TAccountOwner;
  },
  args: ApproveTokenDelegateInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<TProgram>,
  remainingAccounts?: TRemainingAccounts
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.source, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.delegate, AccountRole.READONLY),
      accountMetaWithDefault(accounts.owner, AccountRole.READONLY_SIGNER),
      ...(remainingAccounts ?? []),
    ],
    data: getApproveTokenDelegateInstructionDataEncoder().encode(args),
    programAddress,
  } as ApproveTokenDelegateInstruction<
    TProgram,
    TAccountSource,
    TAccountDelegate,
    TAccountOwner,
    TRemainingAccounts
  >;
}

// Input.
export type ApproveTokenDelegateInput<
  TAccountSource extends string,
  TAccountDelegate extends string,
  TAccountOwner extends string
> = {
  source: Base58EncodedAddress<TAccountSource>;
  delegate: Base58EncodedAddress<TAccountDelegate>;
  owner: Signer<TAccountOwner>;
  amount: ApproveTokenDelegateInstructionDataArgs['amount'];
};

export async function approveTokenDelegate<
  TReturn,
  TAccountSource extends string,
  TAccountDelegate extends string,
  TAccountOwner extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      ApproveTokenDelegateInstruction<
        TProgram,
        TAccountSource,
        TAccountDelegate,
        TAccountOwner
      >,
      TReturn
    >,
  input: ApproveTokenDelegateInput<
    TAccountSource,
    TAccountDelegate,
    TAccountOwner
  >
): Promise<TReturn>;
export async function approveTokenDelegate<
  TAccountSource extends string,
  TAccountDelegate extends string,
  TAccountOwner extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: ApproveTokenDelegateInput<
    TAccountSource,
    TAccountDelegate,
    TAccountOwner
  >
): Promise<
  WrappedInstruction<
    ApproveTokenDelegateInstruction<
      TProgram,
      TAccountSource,
      TAccountDelegate,
      TAccountOwner
    >
  >
>;
export async function approveTokenDelegate<
  TAccountSource extends string,
  TAccountDelegate extends string,
  TAccountOwner extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  input: ApproveTokenDelegateInput<
    TAccountSource,
    TAccountDelegate,
    TAccountOwner
  >
): Promise<
  WrappedInstruction<
    ApproveTokenDelegateInstruction<
      TProgram,
      TAccountSource,
      TAccountDelegate,
      TAccountOwner
    >
  >
>;
export async function approveTokenDelegate<
  TReturn,
  TAccountSource extends string,
  TAccountDelegate extends string,
  TAccountOwner extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>)
    | ApproveTokenDelegateInput<
        TAccountSource,
        TAccountDelegate,
        TAccountOwner
      >,
  rawInput?: ApproveTokenDelegateInput<
    TAccountSource,
    TAccountDelegate,
    TAccountOwner
  >
): Promise<TReturn | WrappedInstruction<IInstruction>> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as ApproveTokenDelegateInput<
    TAccountSource,
    TAccountDelegate,
    TAccountOwner
  >;

  // Program address.
  const defaultProgramAddress =
    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'>;
  const programAddress = (
    context.getProgramAddress
      ? await context.getProgramAddress({
          name: 'splToken',
          address: defaultProgramAddress,
        })
      : defaultProgramAddress
  ) as Base58EncodedAddress<TProgram>;

  // Original accounts.
  type AccountMetas = Parameters<
    typeof approveTokenDelegateInstruction<
      TProgram,
      TAccountSource,
      TAccountDelegate,
      TAccountOwner
    >
  >[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    source: { value: input.source ?? null, isWritable: true },
    delegate: { value: input.delegate ?? null, isWritable: false },
    owner: { value: input.owner ?? null, isWritable: false },
  };

  // Original args.
  const args = { ...input };

  // Get account metas and signers.
  const [accountMetas, signers] = getAccountMetasAndSigners(
    accounts,
    'programId',
    programAddress
  );

  // Remaining accounts.
  const remainingAccounts: IAccountMeta[] = [];

  // Bytes created on chain.
  const bytesCreatedOnChain = 0;

  return {
    instruction: approveTokenDelegateInstruction(
      accountMetas as Record<keyof AccountMetas, IAccountMeta>,
      args as ApproveTokenDelegateInstructionDataArgs,
      programAddress,
      remainingAccounts
    ),
    signers,
    bytesCreatedOnChain,
  };
}
