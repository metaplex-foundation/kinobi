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
  ReadonlySignerAccount,
  WritableAccount,
} from '@solana/instructions';
import {
  Context,
  CustomGeneratedInstruction,
  Signer,
  WrappedInstruction,
  accountMetaWithDefault,
} from '../shared';

// Output.
export type FreezeTokenInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountOwner extends string | IAccountMeta<string> = string
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
        ? ReadonlySignerAccount<TAccountOwner>
        : TAccountOwner
    ]
  >;

export type FreezeTokenInstructionData = { discriminator: number };

export type FreezeTokenInstructionDataArgs = {};

export function getFreezeTokenInstructionDataEncoder(): Encoder<FreezeTokenInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<FreezeTokenInstructionData>(
      [['discriminator', getU8Encoder()]],
      { description: 'FreezeTokenInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 10 } as FreezeTokenInstructionData)
  ) as Encoder<FreezeTokenInstructionDataArgs>;
}

export function getFreezeTokenInstructionDataDecoder(): Decoder<FreezeTokenInstructionData> {
  return getStructDecoder<FreezeTokenInstructionData>(
    [['discriminator', getU8Decoder()]],
    { description: 'FreezeTokenInstructionData' }
  ) as Decoder<FreezeTokenInstructionData>;
}

export function getFreezeTokenInstructionDataCodec(): Codec<
  FreezeTokenInstructionDataArgs,
  FreezeTokenInstructionData
> {
  return combineCodec(
    getFreezeTokenInstructionDataEncoder(),
    getFreezeTokenInstructionDataDecoder()
  );
}

export function freezeTokenInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountOwner extends string | IAccountMeta<string> = string
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
  },
  programAddress: Base58EncodedAddress<TProgram> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.account, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.mint, AccountRole.READONLY),
      accountMetaWithDefault(accounts.owner, AccountRole.READONLY_SIGNER),
    ],
    data: getFreezeTokenInstructionDataEncoder().encode({}),
    programAddress,
  } as FreezeTokenInstruction<
    TProgram,
    TAccountAccount,
    TAccountMint,
    TAccountOwner
  >;
}

// Input.
export type FreezeTokenInput<
  TAccountAccount extends string,
  TAccountMint extends string,
  TAccountOwner extends string
> = {
  account: Base58EncodedAddress<TAccountAccount>;
  mint: Base58EncodedAddress<TAccountMint>;
  owner: Signer<TAccountOwner>;
};

export async function freezeToken<
  TReturn,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string = string,
  TAccountMint extends string = string,
  TAccountOwner extends string = string
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      FreezeTokenInstruction<
        TProgram,
        TAccountAccount,
        TAccountMint,
        TAccountOwner
      >,
      TReturn
    >,
  input: FreezeTokenInput<TAccountAccount, TAccountMint, TAccountOwner>
): Promise<TReturn>;
export async function freezeToken<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string = string,
  TAccountMint extends string = string,
  TAccountOwner extends string = string
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: FreezeTokenInput<TAccountAccount, TAccountMint, TAccountOwner>
): Promise<
  WrappedInstruction<
    FreezeTokenInstruction<
      TProgram,
      TAccountAccount,
      TAccountMint,
      TAccountOwner
    >
  >
>;
export async function freezeToken<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string = string,
  TAccountMint extends string = string,
  TAccountOwner extends string = string
>(
  input: FreezeTokenInput<TAccountAccount, TAccountMint, TAccountOwner>
): Promise<
  WrappedInstruction<
    FreezeTokenInstruction<
      TProgram,
      TAccountAccount,
      TAccountMint,
      TAccountOwner
    >
  >
>;
export async function freezeToken<
  TReturn,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string = string,
  TAccountMint extends string = string,
  TAccountOwner extends string = string
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          FreezeTokenInstruction<
            TProgram,
            TAccountAccount,
            TAccountMint,
            TAccountOwner
          >,
          TReturn
        >)
    | FreezeTokenInput<TAccountAccount, TAccountMint, TAccountOwner>,
  rawInput?: FreezeTokenInput<TAccountAccount, TAccountMint, TAccountOwner>
): Promise<
  | TReturn
  | WrappedInstruction<
      FreezeTokenInstruction<
        TProgram,
        TAccountAccount,
        TAccountMint,
        TAccountOwner
      >
    >
> {
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          FreezeTokenInstruction<
            TProgram,
            TAccountAccount,
            TAccountMint,
            TAccountOwner
          >,
          TReturn
        >);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as FreezeTokenInput<TAccountAccount, TAccountMint, TAccountOwner>;

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

  return {
    instruction: freezeTokenInstruction(input as any, programAddress),
    signers: [],
    bytesCreatedOnChain: 0,
  };
}
