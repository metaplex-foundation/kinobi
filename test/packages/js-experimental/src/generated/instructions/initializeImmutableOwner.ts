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
  IAccountMeta,
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  WritableAccount,
} from '@solana/instructions';
import {
  Context,
  CustomGeneratedInstruction,
  ResolvedAccount,
  WrappedInstruction,
  accountMetaWithDefault,
  getAccountMetasAndSigners,
} from '../shared';

// Output.
export type InitializeImmutableOwnerInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountAccount extends string
        ? WritableAccount<TAccountAccount>
        : TAccountAccount,
      ...TRemainingAccounts
    ]
  >;

export type InitializeImmutableOwnerInstructionData = { discriminator: number };

export type InitializeImmutableOwnerInstructionDataArgs = {};

export function getInitializeImmutableOwnerInstructionDataEncoder(): Encoder<InitializeImmutableOwnerInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<{ discriminator: number }>(
      [['discriminator', getU8Encoder()]],
      { description: 'InitializeImmutableOwnerInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 22 })
  ) as Encoder<InitializeImmutableOwnerInstructionDataArgs>;
}

export function getInitializeImmutableOwnerInstructionDataDecoder(): Decoder<InitializeImmutableOwnerInstructionData> {
  return getStructDecoder<InitializeImmutableOwnerInstructionData>(
    [['discriminator', getU8Decoder()]],
    { description: 'InitializeImmutableOwnerInstructionData' }
  ) as Decoder<InitializeImmutableOwnerInstructionData>;
}

export function getInitializeImmutableOwnerInstructionDataCodec(): Codec<
  InitializeImmutableOwnerInstructionDataArgs,
  InitializeImmutableOwnerInstructionData
> {
  return combineCodec(
    getInitializeImmutableOwnerInstructionDataEncoder(),
    getInitializeImmutableOwnerInstructionDataDecoder()
  );
}

export function initializeImmutableOwnerInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
>(
  accounts: {
    account: TAccountAccount extends string
      ? Base58EncodedAddress<TAccountAccount>
      : TAccountAccount;
  },
  programAddress: Base58EncodedAddress<TProgram> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<TProgram>,
  remainingAccounts?: TRemainingAccounts
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.account, AccountRole.WRITABLE),
      ...(remainingAccounts ?? []),
    ],
    data: getInitializeImmutableOwnerInstructionDataEncoder().encode({}),
    programAddress,
  } as InitializeImmutableOwnerInstruction<
    TProgram,
    TAccountAccount,
    TRemainingAccounts
  >;
}

// Input.
export type InitializeImmutableOwnerInput<TAccountAccount extends string> = {
  account: Base58EncodedAddress<TAccountAccount>;
};

export async function initializeImmutableOwner<
  TReturn,
  TAccountAccount extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      InitializeImmutableOwnerInstruction<TProgram, TAccountAccount>,
      TReturn
    >,
  input: InitializeImmutableOwnerInput<TAccountAccount>
): Promise<TReturn>;
export async function initializeImmutableOwner<
  TAccountAccount extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: InitializeImmutableOwnerInput<TAccountAccount>
): Promise<
  WrappedInstruction<
    InitializeImmutableOwnerInstruction<TProgram, TAccountAccount>
  >
>;
export async function initializeImmutableOwner<
  TAccountAccount extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  input: InitializeImmutableOwnerInput<TAccountAccount>
): Promise<
  WrappedInstruction<
    InitializeImmutableOwnerInstruction<TProgram, TAccountAccount>
  >
>;
export async function initializeImmutableOwner<
  TReturn,
  TAccountAccount extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>)
    | InitializeImmutableOwnerInput<TAccountAccount>,
  rawInput?: InitializeImmutableOwnerInput<TAccountAccount>
): Promise<TReturn | WrappedInstruction<IInstruction>> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as InitializeImmutableOwnerInput<TAccountAccount>;

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
    typeof initializeImmutableOwnerInstruction<TProgram, TAccountAccount>
  >[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    account: { value: input.account ?? null, isWritable: true },
  };

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
    instruction: initializeImmutableOwnerInstruction(
      accountMetas as Record<keyof AccountMetas, IAccountMeta>,
      programAddress,
      remainingAccounts
    ),
    signers,
    bytesCreatedOnChain,
  };
}
