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
export type AmountToUiAmountInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMint extends string | IAccountMeta<string> = string
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [TAccountMint extends string ? ReadonlyAccount<TAccountMint> : TAccountMint]
  >;

export type AmountToUiAmountInstructionData = {
  discriminator: number;
  amount: bigint;
};

export type AmountToUiAmountInstructionDataArgs = { amount: number | bigint };

export function getAmountToUiAmountInstructionDataEncoder(): Encoder<AmountToUiAmountInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<AmountToUiAmountInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['amount', getU64Encoder()],
      ],
      { description: 'AmountToUiAmountInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 23 } as AmountToUiAmountInstructionData)
  ) as Encoder<AmountToUiAmountInstructionDataArgs>;
}

export function getAmountToUiAmountInstructionDataDecoder(): Decoder<AmountToUiAmountInstructionData> {
  return getStructDecoder<AmountToUiAmountInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['amount', getU64Decoder()],
    ],
    { description: 'AmountToUiAmountInstructionData' }
  ) as Decoder<AmountToUiAmountInstructionData>;
}

export function getAmountToUiAmountInstructionDataCodec(): Codec<
  AmountToUiAmountInstructionDataArgs,
  AmountToUiAmountInstructionData
> {
  return combineCodec(
    getAmountToUiAmountInstructionDataEncoder(),
    getAmountToUiAmountInstructionDataDecoder()
  );
}

export function amountToUiAmountInstruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMint extends string | IAccountMeta<string> = string
>(
  accounts: {
    mint: TAccountMint extends string
      ? Base58EncodedAddress<TAccountMint>
      : TAccountMint;
  },
  args: AmountToUiAmountInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [accountMetaWithDefault(accounts.mint, AccountRole.READONLY)],
    data: getAmountToUiAmountInstructionDataEncoder().encode(args),
    programAddress,
  } as AmountToUiAmountInstruction<TProgram, TAccountMint>;
}

// Input.
export type AmountToUiAmountInput<TAccountMint extends string> = {
  mint: Base58EncodedAddress<TAccountMint>;
  amount: AmountToUiAmountInstructionDataArgs['amount'];
};

export async function amountToUiAmount<
  TReturn,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMint extends string = string
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      AmountToUiAmountInstruction<TProgram, TAccountMint>,
      TReturn
    >,
  input: AmountToUiAmountInput<TAccountMint>
): Promise<TReturn>;
export async function amountToUiAmount<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMint extends string = string
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: AmountToUiAmountInput<TAccountMint>
): Promise<
  WrappedInstruction<AmountToUiAmountInstruction<TProgram, TAccountMint>>
>;
export async function amountToUiAmount<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMint extends string = string
>(
  input: AmountToUiAmountInput<TAccountMint>
): Promise<
  WrappedInstruction<AmountToUiAmountInstruction<TProgram, TAccountMint>>
>;
export async function amountToUiAmount<
  TReturn,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMint extends string = string
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          AmountToUiAmountInstruction<TProgram, TAccountMint>,
          TReturn
        >)
    | AmountToUiAmountInput<TAccountMint>,
  rawInput?: AmountToUiAmountInput<TAccountMint>
): Promise<
  | TReturn
  | WrappedInstruction<AmountToUiAmountInstruction<TProgram, TAccountMint>>
> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          AmountToUiAmountInstruction<TProgram, TAccountMint>,
          TReturn
        >);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as AmountToUiAmountInput<TAccountMint>;

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
  type AccountMetas = Parameters<typeof amountToUiAmountInstruction>[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    mint: { value: input.mint ?? null, isWritable: false },
  };

  // Original args.
  const args = { ...input };

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
    instruction: amountToUiAmountInstruction(
      accountMetas as AccountMetas,
      args,
      programAddress
    ) as AmountToUiAmountInstruction<TProgram, TAccountMint>,
    signers,
    bytesCreatedOnChain: 0,
  };
}
