/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Base58EncodedAddress,
  getAddressDecoder,
  getAddressEncoder,
} from '@solana/addresses';
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
  Option,
  OptionOrNullable,
  getOptionDecoder,
  getOptionEncoder,
} from '@solana/options';
import {
  Context,
  CustomGeneratedInstruction,
  ResolvedAccount,
  WrappedInstruction,
  accountMetaWithDefault,
  getAccountMetasAndSigners,
} from '../shared';

// Output.
export type InitializeMintInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountRent extends
    | string
    | IAccountMeta<string> = 'SysvarRent111111111111111111111111111111111'
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountMint extends string
        ? WritableAccount<TAccountMint>
        : TAccountMint,
      TAccountRent extends string ? ReadonlyAccount<TAccountRent> : TAccountRent
    ]
  >;

export type InitializeMintInstructionData = {
  discriminator: number;
  decimals: number;
  mintAuthority: Base58EncodedAddress;
  freezeAuthority: Option<Base58EncodedAddress>;
};

export type InitializeMintInstructionDataArgs = {
  decimals: number;
  mintAuthority: Base58EncodedAddress;
  freezeAuthority: OptionOrNullable<Base58EncodedAddress>;
};

export function getInitializeMintInstructionDataEncoder(): Encoder<InitializeMintInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<InitializeMintInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['decimals', getU8Encoder()],
        ['mintAuthority', getAddressEncoder()],
        ['freezeAuthority', getOptionEncoder(getAddressEncoder())],
      ],
      { description: 'InitializeMintInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 0 } as InitializeMintInstructionData)
  ) as Encoder<InitializeMintInstructionDataArgs>;
}

export function getInitializeMintInstructionDataDecoder(): Decoder<InitializeMintInstructionData> {
  return getStructDecoder<InitializeMintInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['decimals', getU8Decoder()],
      ['mintAuthority', getAddressDecoder()],
      ['freezeAuthority', getOptionDecoder(getAddressDecoder())],
    ],
    { description: 'InitializeMintInstructionData' }
  ) as Decoder<InitializeMintInstructionData>;
}

export function getInitializeMintInstructionDataCodec(): Codec<
  InitializeMintInstructionDataArgs,
  InitializeMintInstructionData
> {
  return combineCodec(
    getInitializeMintInstructionDataEncoder(),
    getInitializeMintInstructionDataDecoder()
  );
}

export function initializeMintInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountRent extends
    | string
    | IAccountMeta<string> = 'SysvarRent111111111111111111111111111111111'
>(
  accounts: {
    mint: TAccountMint extends string
      ? Base58EncodedAddress<TAccountMint>
      : TAccountMint;
    rent?: TAccountRent extends string
      ? Base58EncodedAddress<TAccountRent>
      : TAccountRent;
  },
  args: InitializeMintInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.mint, AccountRole.WRITABLE),
      accountMetaWithDefault(
        accounts.rent ?? 'SysvarRent111111111111111111111111111111111',
        AccountRole.READONLY
      ),
    ],
    data: getInitializeMintInstructionDataEncoder().encode(args),
    programAddress,
  } as InitializeMintInstruction<TProgram, TAccountMint, TAccountRent>;
}

// Input.
export type InitializeMintInput<
  TAccountMint extends string,
  TAccountRent extends string
> = {
  mint: Base58EncodedAddress<TAccountMint>;
  rent?: Base58EncodedAddress<TAccountRent>;
  decimals: InitializeMintInstructionDataArgs['decimals'];
  mintAuthority: InitializeMintInstructionDataArgs['mintAuthority'];
  freezeAuthority: InitializeMintInstructionDataArgs['freezeAuthority'];
};

export async function initializeMint<
  TReturn,
  TAccountMint extends string,
  TAccountRent extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      InitializeMintInstruction<TProgram, TAccountMint, TAccountRent>,
      TReturn
    >,
  input: InitializeMintInput<TAccountMint, TAccountRent>
): Promise<TReturn>;
export async function initializeMint<
  TAccountMint extends string,
  TAccountRent extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: InitializeMintInput<TAccountMint, TAccountRent>
): Promise<
  WrappedInstruction<
    InitializeMintInstruction<TProgram, TAccountMint, TAccountRent>
  >
>;
export async function initializeMint<
  TAccountMint extends string,
  TAccountRent extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  input: InitializeMintInput<TAccountMint, TAccountRent>
): Promise<
  WrappedInstruction<
    InitializeMintInstruction<TProgram, TAccountMint, TAccountRent>
  >
>;
export async function initializeMint<
  TReturn,
  TAccountMint extends string,
  TAccountRent extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>)
    | InitializeMintInput<TAccountMint, TAccountRent>,
  rawInput?: InitializeMintInput<TAccountMint, TAccountRent>
): Promise<TReturn | WrappedInstruction<IInstruction>> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as InitializeMintInput<TAccountMint, TAccountRent>;

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
  type AccountMetas = Parameters<typeof initializeMintInstruction>[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    mint: { value: input.mint ?? null, isWritable: true },
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
  // TODO

  // Bytes created on chain.
  // TODO

  return {
    instruction: initializeMintInstruction(
      accountMetas as AccountMetas,
      args,
      programAddress
    ) as InitializeMintInstruction<TProgram, TAccountMint, TAccountRent>,
    signers,
    bytesCreatedOnChain: 0,
  };
}
