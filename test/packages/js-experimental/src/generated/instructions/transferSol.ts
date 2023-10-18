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
  getU32Decoder,
  getU32Encoder,
  getU64Decoder,
  getU64Encoder,
} from '@solana/codecs-numbers';
import {
  AccountRole,
  IAccountMeta,
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
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
  getAccountMetasAndSigners,
} from '../shared';

// Output.
export type TransferSolInstruction<
  TProgram extends string = '11111111111111111111111111111111',
  TAccountSource extends string | IAccountMeta<string> = string,
  TAccountDestination extends string | IAccountMeta<string> = string
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountSource extends string
        ? WritableSignerAccount<TAccountSource>
        : TAccountSource,
      TAccountDestination extends string
        ? WritableAccount<TAccountDestination>
        : TAccountDestination
    ]
  >;

export type TransferSolInstructionData = {
  discriminator: number;
  amount: bigint;
};

export type TransferSolInstructionDataArgs = { amount: number | bigint };

export function getTransferSolInstructionDataEncoder(): Encoder<TransferSolInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<TransferSolInstructionData>(
      [
        ['discriminator', getU32Encoder()],
        ['amount', getU64Encoder()],
      ],
      { description: 'TransferSolInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 2 } as TransferSolInstructionData)
  ) as Encoder<TransferSolInstructionDataArgs>;
}

export function getTransferSolInstructionDataDecoder(): Decoder<TransferSolInstructionData> {
  return getStructDecoder<TransferSolInstructionData>(
    [
      ['discriminator', getU32Decoder()],
      ['amount', getU64Decoder()],
    ],
    { description: 'TransferSolInstructionData' }
  ) as Decoder<TransferSolInstructionData>;
}

export function getTransferSolInstructionDataCodec(): Codec<
  TransferSolInstructionDataArgs,
  TransferSolInstructionData
> {
  return combineCodec(
    getTransferSolInstructionDataEncoder(),
    getTransferSolInstructionDataDecoder()
  );
}

export function transferSolInstruction<
  TProgram extends string = '11111111111111111111111111111111',
  TAccountSource extends string | IAccountMeta<string> = string,
  TAccountDestination extends string | IAccountMeta<string> = string
>(
  accounts: {
    source: TAccountSource extends string
      ? Base58EncodedAddress<TAccountSource>
      : TAccountSource;
    destination: TAccountDestination extends string
      ? Base58EncodedAddress<TAccountDestination>
      : TAccountDestination;
  },
  args: TransferSolInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = '11111111111111111111111111111111' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.source, AccountRole.WRITABLE_SIGNER),
      accountMetaWithDefault(accounts.destination, AccountRole.WRITABLE),
    ],
    data: getTransferSolInstructionDataEncoder().encode(args),
    programAddress,
  } as TransferSolInstruction<TProgram, TAccountSource, TAccountDestination>;
}

// Input.
export type TransferSolInput<
  TAccountSource extends string,
  TAccountDestination extends string
> = {
  source: Signer<TAccountSource>;
  destination: Base58EncodedAddress<TAccountDestination>;
  amount: TransferSolInstructionDataArgs['amount'];
};

export async function transferSol<
  TReturn,
  TProgram extends string = '11111111111111111111111111111111',
  TAccountSource extends string = string,
  TAccountDestination extends string = string
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      TransferSolInstruction<TProgram, TAccountSource, TAccountDestination>,
      TReturn
    >,
  input: TransferSolInput<TAccountSource, TAccountDestination>
): Promise<TReturn>;
export async function transferSol<
  TProgram extends string = '11111111111111111111111111111111',
  TAccountSource extends string = string,
  TAccountDestination extends string = string
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: TransferSolInput<TAccountSource, TAccountDestination>
): Promise<
  WrappedInstruction<
    TransferSolInstruction<TProgram, TAccountSource, TAccountDestination>
  >
>;
export async function transferSol<
  TProgram extends string = '11111111111111111111111111111111',
  TAccountSource extends string = string,
  TAccountDestination extends string = string
>(
  input: TransferSolInput<TAccountSource, TAccountDestination>
): Promise<
  WrappedInstruction<
    TransferSolInstruction<TProgram, TAccountSource, TAccountDestination>
  >
>;
export async function transferSol<
  TReturn,
  TProgram extends string = '11111111111111111111111111111111',
  TAccountSource extends string = string,
  TAccountDestination extends string = string
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          TransferSolInstruction<TProgram, TAccountSource, TAccountDestination>,
          TReturn
        >)
    | TransferSolInput<TAccountSource, TAccountDestination>,
  rawInput?: TransferSolInput<TAccountSource, TAccountDestination>
): Promise<
  | TReturn
  | WrappedInstruction<
      TransferSolInstruction<TProgram, TAccountSource, TAccountDestination>
    >
> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          TransferSolInstruction<TProgram, TAccountSource, TAccountDestination>,
          TReturn
        >);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as TransferSolInput<TAccountSource, TAccountDestination>;

  // Program address.
  const defaultProgramAddress =
    '11111111111111111111111111111111' as Base58EncodedAddress<'11111111111111111111111111111111'>;
  const programAddress = (
    context.getProgramAddress
      ? await context.getProgramAddress({
          name: 'splSystem',
          address: defaultProgramAddress,
        })
      : defaultProgramAddress
  ) as Base58EncodedAddress<TProgram>;

  // Original accounts.
  type AccountMetas = Parameters<typeof transferSolInstruction>[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    source: { value: input.source ?? null, isWritable: true },
    destination: { value: input.destination ?? null, isWritable: true },
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
    instruction: transferSolInstruction(
      accountMetas as AccountMetas,
      args,
      programAddress
    ) as TransferSolInstruction<TProgram, TAccountSource, TAccountDestination>,
    signers,
    bytesCreatedOnChain: 0,
  };
}
