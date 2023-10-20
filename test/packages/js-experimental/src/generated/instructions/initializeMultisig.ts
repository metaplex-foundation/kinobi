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
  ReadonlyAccount,
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
export type InitializeMultisigInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMultisig extends string | IAccountMeta<string> = string,
  TAccountRent extends
    | string
    | IAccountMeta<string> = 'SysvarRent111111111111111111111111111111111',
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountMultisig extends string
        ? WritableAccount<TAccountMultisig>
        : TAccountMultisig,
      TAccountRent extends string
        ? ReadonlyAccount<TAccountRent>
        : TAccountRent,
      ...TRemainingAccounts
    ]
  >;

export type InitializeMultisigInstructionData = {
  discriminator: number;
  m: number;
};

export type InitializeMultisigInstructionDataArgs = { m: number };

export function getInitializeMultisigInstructionDataEncoder(): Encoder<InitializeMultisigInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<{ discriminator: number; m: number }>(
      [
        ['discriminator', getU8Encoder()],
        ['m', getU8Encoder()],
      ],
      { description: 'InitializeMultisigInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 2 })
  ) as Encoder<InitializeMultisigInstructionDataArgs>;
}

export function getInitializeMultisigInstructionDataDecoder(): Decoder<InitializeMultisigInstructionData> {
  return getStructDecoder<InitializeMultisigInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['m', getU8Decoder()],
    ],
    { description: 'InitializeMultisigInstructionData' }
  ) as Decoder<InitializeMultisigInstructionData>;
}

export function getInitializeMultisigInstructionDataCodec(): Codec<
  InitializeMultisigInstructionDataArgs,
  InitializeMultisigInstructionData
> {
  return combineCodec(
    getInitializeMultisigInstructionDataEncoder(),
    getInitializeMultisigInstructionDataDecoder()
  );
}

export function initializeMultisigInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMultisig extends string | IAccountMeta<string> = string,
  TAccountRent extends
    | string
    | IAccountMeta<string> = 'SysvarRent111111111111111111111111111111111',
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
>(
  accounts: {
    multisig: TAccountMultisig extends string
      ? Base58EncodedAddress<TAccountMultisig>
      : TAccountMultisig;
    rent?: TAccountRent extends string
      ? Base58EncodedAddress<TAccountRent>
      : TAccountRent;
  },
  args: InitializeMultisigInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<TProgram>,
  remainingAccounts?: TRemainingAccounts
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.multisig, AccountRole.WRITABLE),
      accountMetaWithDefault(
        accounts.rent ?? 'SysvarRent111111111111111111111111111111111',
        AccountRole.READONLY
      ),
      ...(remainingAccounts ?? []),
    ],
    data: getInitializeMultisigInstructionDataEncoder().encode(args),
    programAddress,
  } as InitializeMultisigInstruction<
    TProgram,
    TAccountMultisig,
    TAccountRent,
    TRemainingAccounts
  >;
}

// Input.
export type InitializeMultisigInput<
  TAccountMultisig extends string,
  TAccountRent extends string
> = {
  multisig: Base58EncodedAddress<TAccountMultisig>;
  rent?: Base58EncodedAddress<TAccountRent>;
  m: InitializeMultisigInstructionDataArgs['m'];
};

export async function initializeMultisig<
  TReturn,
  TAccountMultisig extends string,
  TAccountRent extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      InitializeMultisigInstruction<TProgram, TAccountMultisig, TAccountRent>,
      TReturn
    >,
  input: InitializeMultisigInput<TAccountMultisig, TAccountRent>
): Promise<TReturn>;
export async function initializeMultisig<
  TAccountMultisig extends string,
  TAccountRent extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: InitializeMultisigInput<TAccountMultisig, TAccountRent>
): Promise<
  WrappedInstruction<
    InitializeMultisigInstruction<TProgram, TAccountMultisig, TAccountRent>
  >
>;
export async function initializeMultisig<
  TAccountMultisig extends string,
  TAccountRent extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  input: InitializeMultisigInput<TAccountMultisig, TAccountRent>
): Promise<
  WrappedInstruction<
    InitializeMultisigInstruction<TProgram, TAccountMultisig, TAccountRent>
  >
>;
export async function initializeMultisig<
  TReturn,
  TAccountMultisig extends string,
  TAccountRent extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>)
    | InitializeMultisigInput<TAccountMultisig, TAccountRent>,
  rawInput?: InitializeMultisigInput<TAccountMultisig, TAccountRent>
): Promise<TReturn | WrappedInstruction<IInstruction>> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as InitializeMultisigInput<TAccountMultisig, TAccountRent>;

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
    typeof initializeMultisigInstruction<
      TProgram,
      TAccountMultisig,
      TAccountRent
    >
  >[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    multisig: { value: input.multisig ?? null, isWritable: true },
    rent: { value: input.rent ?? null, isWritable: false },
  };

  // Original args.
  const args = { ...input };

  // Resolve default values.
  if (!accounts.rent.value) {
    accounts.rent.value =
      'SysvarRent111111111111111111111111111111111' as Base58EncodedAddress<'SysvarRent111111111111111111111111111111111'>;
  }

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
    instruction: initializeMultisigInstruction(
      accountMetas as Record<keyof AccountMetas, IAccountMeta>,
      args as InitializeMultisigInstructionDataArgs,
      programAddress,
      remainingAccounts
    ),
    signers,
    bytesCreatedOnChain,
  };
}
