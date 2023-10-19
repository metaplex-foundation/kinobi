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
  Context,
  CustomGeneratedInstruction,
  ResolvedAccount,
  WrappedInstruction,
  accountMetaWithDefault,
  getAccountMetasAndSigners,
} from '../shared';

// Output.
export type InitializeToken3Instruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountAccount extends string
        ? WritableAccount<TAccountAccount>
        : TAccountAccount,
      TAccountMint extends string ? ReadonlyAccount<TAccountMint> : TAccountMint
    ]
  >;

export type InitializeToken3InstructionData = {
  discriminator: number;
  owner: Base58EncodedAddress;
};

export type InitializeToken3InstructionDataArgs = {
  owner: Base58EncodedAddress;
};

export function getInitializeToken3InstructionDataEncoder(): Encoder<InitializeToken3InstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<InitializeToken3InstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['owner', getAddressEncoder()],
      ],
      { description: 'InitializeToken3InstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 18 } as InitializeToken3InstructionData)
  ) as Encoder<InitializeToken3InstructionDataArgs>;
}

export function getInitializeToken3InstructionDataDecoder(): Decoder<InitializeToken3InstructionData> {
  return getStructDecoder<InitializeToken3InstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['owner', getAddressDecoder()],
    ],
    { description: 'InitializeToken3InstructionData' }
  ) as Decoder<InitializeToken3InstructionData>;
}

export function getInitializeToken3InstructionDataCodec(): Codec<
  InitializeToken3InstructionDataArgs,
  InitializeToken3InstructionData
> {
  return combineCodec(
    getInitializeToken3InstructionDataEncoder(),
    getInitializeToken3InstructionDataDecoder()
  );
}

export function initializeToken3Instruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountAccount extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string
>(
  accounts: {
    account: TAccountAccount extends string
      ? Base58EncodedAddress<TAccountAccount>
      : TAccountAccount;
    mint: TAccountMint extends string
      ? Base58EncodedAddress<TAccountMint>
      : TAccountMint;
  },
  args: InitializeToken3InstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.account, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.mint, AccountRole.READONLY),
    ],
    data: getInitializeToken3InstructionDataEncoder().encode(args),
    programAddress,
  } as InitializeToken3Instruction<TProgram, TAccountAccount, TAccountMint>;
}

// Input.
export type InitializeToken3Input<
  TAccountAccount extends string,
  TAccountMint extends string
> = {
  account: Base58EncodedAddress<TAccountAccount>;
  mint: Base58EncodedAddress<TAccountMint>;
  owner: InitializeToken3InstructionDataArgs['owner'];
};

export async function initializeToken3<
  TReturn,
  TAccountAccount extends string,
  TAccountMint extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      InitializeToken3Instruction<TProgram, TAccountAccount, TAccountMint>,
      TReturn
    >,
  input: InitializeToken3Input<TAccountAccount, TAccountMint>
): Promise<TReturn>;
export async function initializeToken3<
  TAccountAccount extends string,
  TAccountMint extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: InitializeToken3Input<TAccountAccount, TAccountMint>
): Promise<
  WrappedInstruction<
    InitializeToken3Instruction<TProgram, TAccountAccount, TAccountMint>
  >
>;
export async function initializeToken3<
  TAccountAccount extends string,
  TAccountMint extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  input: InitializeToken3Input<TAccountAccount, TAccountMint>
): Promise<
  WrappedInstruction<
    InitializeToken3Instruction<TProgram, TAccountAccount, TAccountMint>
  >
>;
export async function initializeToken3<
  TReturn,
  TAccountAccount extends string,
  TAccountMint extends string,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>)
    | InitializeToken3Input<TAccountAccount, TAccountMint>,
  rawInput?: InitializeToken3Input<TAccountAccount, TAccountMint>
): Promise<TReturn | WrappedInstruction<IInstruction>> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as InitializeToken3Input<TAccountAccount, TAccountMint>;

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
    typeof initializeToken3Instruction<TProgram, TAccountAccount, TAccountMint>
  >[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    account: { value: input.account ?? null, isWritable: true },
    mint: { value: input.mint ?? null, isWritable: false },
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
  // TODO

  // Bytes created on chain.
  // TODO

  return {
    instruction: initializeToken3Instruction(
      accountMetas as Record<keyof AccountMetas, IAccountMeta>,
      args,
      programAddress
    ),
    signers,
    bytesCreatedOnChain: 0,
  };
}
