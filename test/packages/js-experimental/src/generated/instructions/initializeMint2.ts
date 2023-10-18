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
export type InitializeMint2Instruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMint extends string | IAccountMeta<string> = string
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [TAccountMint extends string ? WritableAccount<TAccountMint> : TAccountMint]
  >;

export type InitializeMint2InstructionData = {
  discriminator: number;
  decimals: number;
  mintAuthority: Base58EncodedAddress;
  freezeAuthority: Option<Base58EncodedAddress>;
};

export type InitializeMint2InstructionDataArgs = {
  decimals: number;
  mintAuthority: Base58EncodedAddress;
  freezeAuthority: OptionOrNullable<Base58EncodedAddress>;
};

export function getInitializeMint2InstructionDataEncoder(): Encoder<InitializeMint2InstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<InitializeMint2InstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['decimals', getU8Encoder()],
        ['mintAuthority', getAddressEncoder()],
        ['freezeAuthority', getOptionEncoder(getAddressEncoder())],
      ],
      { description: 'InitializeMint2InstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 20 } as InitializeMint2InstructionData)
  ) as Encoder<InitializeMint2InstructionDataArgs>;
}

export function getInitializeMint2InstructionDataDecoder(): Decoder<InitializeMint2InstructionData> {
  return getStructDecoder<InitializeMint2InstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['decimals', getU8Decoder()],
      ['mintAuthority', getAddressDecoder()],
      ['freezeAuthority', getOptionDecoder(getAddressDecoder())],
    ],
    { description: 'InitializeMint2InstructionData' }
  ) as Decoder<InitializeMint2InstructionData>;
}

export function getInitializeMint2InstructionDataCodec(): Codec<
  InitializeMint2InstructionDataArgs,
  InitializeMint2InstructionData
> {
  return combineCodec(
    getInitializeMint2InstructionDataEncoder(),
    getInitializeMint2InstructionDataDecoder()
  );
}

export function initializeMint2Instruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMint extends string | IAccountMeta<string> = string
>(
  accounts: {
    mint: TAccountMint extends string
      ? Base58EncodedAddress<TAccountMint>
      : TAccountMint;
  },
  args: InitializeMint2InstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [accountMetaWithDefault(accounts.mint, AccountRole.WRITABLE)],
    data: getInitializeMint2InstructionDataEncoder().encode(args),
    programAddress,
  } as InitializeMint2Instruction<TProgram, TAccountMint>;
}

// Input.
export type InitializeMint2Input<TAccountMint extends string> = {
  mint: Base58EncodedAddress<TAccountMint>;
  decimals: InitializeMint2InstructionDataArgs['decimals'];
  mintAuthority: InitializeMint2InstructionDataArgs['mintAuthority'];
  freezeAuthority: InitializeMint2InstructionDataArgs['freezeAuthority'];
};

export async function initializeMint2<
  TReturn,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMint extends string = string
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      InitializeMint2Instruction<TProgram, TAccountMint>,
      TReturn
    >,
  input: InitializeMint2Input<TAccountMint>
): Promise<TReturn>;
export async function initializeMint2<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMint extends string = string
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: InitializeMint2Input<TAccountMint>
): Promise<
  WrappedInstruction<InitializeMint2Instruction<TProgram, TAccountMint>>
>;
export async function initializeMint2<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMint extends string = string
>(
  input: InitializeMint2Input<TAccountMint>
): Promise<
  WrappedInstruction<InitializeMint2Instruction<TProgram, TAccountMint>>
>;
export async function initializeMint2<
  TReturn,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMint extends string = string
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          InitializeMint2Instruction<TProgram, TAccountMint>,
          TReturn
        >)
    | InitializeMint2Input<TAccountMint>,
  rawInput?: InitializeMint2Input<TAccountMint>
): Promise<
  | TReturn
  | WrappedInstruction<InitializeMint2Instruction<TProgram, TAccountMint>>
> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          InitializeMint2Instruction<TProgram, TAccountMint>,
          TReturn
        >);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as InitializeMint2Input<TAccountMint>;

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
  type AccountMetas = Parameters<typeof initializeMint2Instruction>[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    mint: { value: input.mint ?? null, isWritable: true },
  };

  // Original args.
  const args = {
    amount: input.amount,
  };

  // Resolve default values.
  // TODO

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
    instruction: initializeMint2Instruction(
      accountMetas as AccountMetas,
      args,
      programAddress
    ) as InitializeMint2Instruction<TProgram, TAccountMint>,
    signers,
    bytesCreatedOnChain: 0,
  };
}
