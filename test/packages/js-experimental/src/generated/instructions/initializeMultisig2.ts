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
export type InitializeMultisig2Instruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMultisig extends string | IAccountMeta<string> = string,
  TAccountSigner extends string | IAccountMeta<string> = string
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountMultisig extends string
        ? WritableAccount<TAccountMultisig>
        : TAccountMultisig,
      TAccountSigner extends string
        ? ReadonlyAccount<TAccountSigner>
        : TAccountSigner
    ]
  >;

export type InitializeMultisig2InstructionData = {
  discriminator: number;
  m: number;
};

export type InitializeMultisig2InstructionDataArgs = { m: number };

export function getInitializeMultisig2InstructionDataEncoder(): Encoder<InitializeMultisig2InstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<InitializeMultisig2InstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['m', getU8Encoder()],
      ],
      { description: 'InitializeMultisig2InstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 19 } as InitializeMultisig2InstructionData)
  ) as Encoder<InitializeMultisig2InstructionDataArgs>;
}

export function getInitializeMultisig2InstructionDataDecoder(): Decoder<InitializeMultisig2InstructionData> {
  return getStructDecoder<InitializeMultisig2InstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['m', getU8Decoder()],
    ],
    { description: 'InitializeMultisig2InstructionData' }
  ) as Decoder<InitializeMultisig2InstructionData>;
}

export function getInitializeMultisig2InstructionDataCodec(): Codec<
  InitializeMultisig2InstructionDataArgs,
  InitializeMultisig2InstructionData
> {
  return combineCodec(
    getInitializeMultisig2InstructionDataEncoder(),
    getInitializeMultisig2InstructionDataDecoder()
  );
}

export function initializeMultisig2Instruction<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMultisig extends string | IAccountMeta<string> = string,
  TAccountSigner extends string | IAccountMeta<string> = string
>(
  accounts: {
    multisig: TAccountMultisig extends string
      ? Base58EncodedAddress<TAccountMultisig>
      : TAccountMultisig;
    signer: TAccountSigner extends string
      ? Base58EncodedAddress<TAccountSigner>
      : TAccountSigner;
  },
  args: InitializeMultisig2InstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.multisig, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.signer, AccountRole.READONLY),
    ],
    data: getInitializeMultisig2InstructionDataEncoder().encode(args),
    programAddress,
  } as InitializeMultisig2Instruction<
    TProgram,
    TAccountMultisig,
    TAccountSigner
  >;
}

// Input.
export type InitializeMultisig2Input<
  TAccountMultisig extends string,
  TAccountSigner extends string
> = {
  multisig: Base58EncodedAddress<TAccountMultisig>;
  signer: Base58EncodedAddress<TAccountSigner>;
  m: InitializeMultisig2InstructionDataArgs['m'];
};

export async function initializeMultisig2<
  TReturn,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMultisig extends string = string,
  TAccountSigner extends string = string
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      InitializeMultisig2Instruction<
        TProgram,
        TAccountMultisig,
        TAccountSigner
      >,
      TReturn
    >,
  input: InitializeMultisig2Input<TAccountMultisig, TAccountSigner>
): Promise<TReturn>;
export async function initializeMultisig2<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMultisig extends string = string,
  TAccountSigner extends string = string
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: InitializeMultisig2Input<TAccountMultisig, TAccountSigner>
): Promise<
  WrappedInstruction<
    InitializeMultisig2Instruction<TProgram, TAccountMultisig, TAccountSigner>
  >
>;
export async function initializeMultisig2<
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMultisig extends string = string,
  TAccountSigner extends string = string
>(
  input: InitializeMultisig2Input<TAccountMultisig, TAccountSigner>
): Promise<
  WrappedInstruction<
    InitializeMultisig2Instruction<TProgram, TAccountMultisig, TAccountSigner>
  >
>;
export async function initializeMultisig2<
  TReturn,
  TProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountMultisig extends string = string,
  TAccountSigner extends string = string
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          InitializeMultisig2Instruction<
            TProgram,
            TAccountMultisig,
            TAccountSigner
          >,
          TReturn
        >)
    | InitializeMultisig2Input<TAccountMultisig, TAccountSigner>,
  rawInput?: InitializeMultisig2Input<TAccountMultisig, TAccountSigner>
): Promise<
  | TReturn
  | WrappedInstruction<
      InitializeMultisig2Instruction<TProgram, TAccountMultisig, TAccountSigner>
    >
> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          InitializeMultisig2Instruction<
            TProgram,
            TAccountMultisig,
            TAccountSigner
          >,
          TReturn
        >);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as InitializeMultisig2Input<TAccountMultisig, TAccountSigner>;

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
  type AccountMetas = Parameters<typeof initializeMultisig2Instruction>[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    multisig: { value: input.multisig ?? null, isWritable: true },
    signer: { value: input.signer ?? null, isWritable: false },
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
    instruction: initializeMultisig2Instruction(
      accountMetas as AccountMetas,
      args,
      programAddress
    ) as InitializeMultisig2Instruction<
      TProgram,
      TAccountMultisig,
      TAccountSigner
    >,
    signers,
    bytesCreatedOnChain: 0,
  };
}
