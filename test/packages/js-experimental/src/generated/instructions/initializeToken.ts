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
export type InitializeTokenInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountOwner extends string | IAccountMeta<string> = string,
  TAccountRent extends
    | string
    | IAccountMeta<string> = 'SysvarRent111111111111111111111111111111111'
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountAccount extends string
        ? WritableAccount<TAccountAccount>
        : TAccountAccount,
      TAccountMint extends string
        ? ReadonlyAccount<TAccountMint>
        : TAccountMint,
      TAccountOwner extends string
        ? ReadonlyAccount<TAccountOwner>
        : TAccountOwner,
      TAccountRent extends string ? ReadonlyAccount<TAccountRent> : TAccountRent
    ]
  >;

export type InitializeTokenInstructionData = { discriminator: number };

export type InitializeTokenInstructionDataArgs = {};

export function getInitializeTokenInstructionDataEncoder(): Encoder<InitializeTokenInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<{ discriminator: number }>(
      [['discriminator', getU8Encoder()]],
      { description: 'InitializeTokenInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 1 })
  ) as Encoder<InitializeTokenInstructionDataArgs>;
}

export function getInitializeTokenInstructionDataDecoder(): Decoder<InitializeTokenInstructionData> {
  return getStructDecoder<InitializeTokenInstructionData>(
    [['discriminator', getU8Decoder()]],
    { description: 'InitializeTokenInstructionData' }
  ) as Decoder<InitializeTokenInstructionData>;
}

export function getInitializeTokenInstructionDataCodec(): Codec<
  InitializeTokenInstructionDataArgs,
  InitializeTokenInstructionData
> {
  return combineCodec(
    getInitializeTokenInstructionDataEncoder(),
    getInitializeTokenInstructionDataDecoder()
  );
}

export function initializeTokenInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountOwner extends string | IAccountMeta<string> = string,
  TAccountRent extends
    | string
    | IAccountMeta<string> = 'SysvarRent111111111111111111111111111111111'
>(
  accounts: {
    account: TAccountAccount extends string
      ? Base58EncodedAddress<TAccountAccount>
      : TAccountAccount;
    mint: TAccountMint extends string
      ? Base58EncodedAddress<TAccountMint>
      : TAccountMint;
    owner: TAccountOwner extends string
      ? Base58EncodedAddress<TAccountOwner>
      : TAccountOwner;
    rent?: TAccountRent extends string
      ? Base58EncodedAddress<TAccountRent>
      : TAccountRent;
  },
  programAddress: Base58EncodedAddress<TProgram> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.account, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.mint, AccountRole.READONLY),
      accountMetaWithDefault(accounts.owner, AccountRole.READONLY),
      accountMetaWithDefault(
        accounts.rent ?? 'SysvarRent111111111111111111111111111111111',
        AccountRole.READONLY
      ),
    ],
    data: getInitializeTokenInstructionDataEncoder().encode({}),
    programAddress,
  } as InitializeTokenInstruction<
    TProgram,
    TAccountAccount,
    TAccountMint,
    TAccountOwner,
    TAccountRent
  >;
}

// Input.
export type InitializeTokenInput<
  TAccountAccount extends string,
  TAccountMint extends string,
  TAccountOwner extends string,
  TAccountRent extends string
> = {
  account: Base58EncodedAddress<TAccountAccount>;
  mint: Base58EncodedAddress<TAccountMint>;
  owner: Base58EncodedAddress<TAccountOwner>;
  rent?: Base58EncodedAddress<TAccountRent>;
};

export async function initializeToken<
  TReturn,
  TAccountAccount extends string,
  TAccountMint extends string,
  TAccountOwner extends string,
  TAccountRent extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      InitializeTokenInstruction<
        TProgram,
        TAccountAccount,
        TAccountMint,
        TAccountOwner,
        TAccountRent
      >,
      TReturn
    >,
  input: InitializeTokenInput<
    TAccountAccount,
    TAccountMint,
    TAccountOwner,
    TAccountRent
  >
): Promise<TReturn>;
export async function initializeToken<
  TAccountAccount extends string,
  TAccountMint extends string,
  TAccountOwner extends string,
  TAccountRent extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: InitializeTokenInput<
    TAccountAccount,
    TAccountMint,
    TAccountOwner,
    TAccountRent
  >
): Promise<
  WrappedInstruction<
    InitializeTokenInstruction<
      TProgram,
      TAccountAccount,
      TAccountMint,
      TAccountOwner,
      TAccountRent
    >
  >
>;
export async function initializeToken<
  TAccountAccount extends string,
  TAccountMint extends string,
  TAccountOwner extends string,
  TAccountRent extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  input: InitializeTokenInput<
    TAccountAccount,
    TAccountMint,
    TAccountOwner,
    TAccountRent
  >
): Promise<
  WrappedInstruction<
    InitializeTokenInstruction<
      TProgram,
      TAccountAccount,
      TAccountMint,
      TAccountOwner,
      TAccountRent
    >
  >
>;
export async function initializeToken<
  TReturn,
  TAccountAccount extends string,
  TAccountMint extends string,
  TAccountOwner extends string,
  TAccountRent extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>)
    | InitializeTokenInput<
        TAccountAccount,
        TAccountMint,
        TAccountOwner,
        TAccountRent
      >,
  rawInput?: InitializeTokenInput<
    TAccountAccount,
    TAccountMint,
    TAccountOwner,
    TAccountRent
  >
): Promise<TReturn | WrappedInstruction<IInstruction>> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as InitializeTokenInput<
    TAccountAccount,
    TAccountMint,
    TAccountOwner,
    TAccountRent
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
    typeof initializeTokenInstruction<
      TProgram,
      TAccountAccount,
      TAccountMint,
      TAccountOwner,
      TAccountRent
    >
  >[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    account: { value: input.account ?? null, isWritable: true },
    mint: { value: input.mint ?? null, isWritable: false },
    owner: { value: input.owner ?? null, isWritable: false },
    rent: { value: input.rent ?? null, isWritable: false },
  };

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
  // TODO

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return {
    instruction: initializeTokenInstruction(
      accountMetas as Record<keyof AccountMetas, IAccountMeta>,
      programAddress
    ),
    signers,
    bytesCreatedOnChain,
  };
}
