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
  Signer,
  WrappedInstruction,
  accountMetaWithDefault,
} from './generated/shared';

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

// ====================================================================================
// ====================================   MANUAL   ====================================
// ====================================================================================

export type CustomGeneratedInstruction<
  TInstruction extends IInstruction,
  TReturn
> = {
  getGeneratedInstruction: (
    wrappedInstruction: WrappedInstruction<TInstruction>
  ) => Promise<TReturn>;
};

export type Context = {
  getProgramAddress?: (program: {
    name: string;
    address: Base58EncodedAddress;
  }) => Promise<Base58EncodedAddress>;
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
  context:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>)
    | TransferSolInput<TAccountSource, TAccountDestination>,
  input?: TransferSolInput<TAccountSource, TAccountDestination>
): Promise<
  | TReturn
  | WrappedInstruction<
      TransferSolInstruction<
        TProgram,
        TAccountSource,
        // typeof input['source'] extends Signer<TAccountSource>
        //   ? WritableSignerAccount<TAccountSource>
        //   : TAccountSource,
        TAccountDestination
      >
    >
> {
  const realContext = (input === undefined ? {} : input) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>);
  const realInput = (input === undefined ? context : input) as TransferSolInput<
    TAccountSource,
    TAccountDestination
  >;
  const defaultProgramAddress =
    '11111111111111111111111111111111' as Base58EncodedAddress<'11111111111111111111111111111111'>;
  const programAddress = (
    realContext.getProgramAddress
      ? await realContext.getProgramAddress({
          name: 'splSystem',
          address: defaultProgramAddress,
        })
      : defaultProgramAddress
  ) as Base58EncodedAddress<TProgram>;

  return {
    instruction: transferSolInstruction(
      realInput as any,
      realInput,
      programAddress
    ),
    signers: [],
    bytesCreatedOnChain: 0,
  };
}

const sourceAddress = 'source' as Base58EncodedAddress<'source'>;
const destinationAddress = 'destination' as Base58EncodedAddress<'destination'>;
const sourceSigner = {
  address: sourceAddress,
  signTransaction: async () => [],
};

export const foo = transferSolInstruction(
  {
    source: sourceAddress,
    destination: destinationAddress,
  },
  { amount: 100 }
);

export const getGeneratedInstruction = async <T extends IInstruction>(
  ix: WrappedInstruction<T>
): Promise<{ potato: T; banana: number }> => ({
  potato: ix.instruction,
  banana: ix.bytesCreatedOnChain,
});
export const barContext = { getGeneratedInstruction };

export const bar = transferSol(
  { getGeneratedInstruction },
  {
    source: sourceSigner,
    destination: destinationAddress,
    amount: 100,
  }
);

export const baz = transferSol({
  source: sourceSigner,
  destination: destinationAddress,
  amount: 100,
});

export type T1 = TransferSolInstruction;
export type T2 = typeof foo;
export type T3 = typeof bar;
export type T4 = typeof baz;
