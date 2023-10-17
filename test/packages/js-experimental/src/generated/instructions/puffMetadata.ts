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
  WritableAccount,
} from '@solana/instructions';
import {
  Context,
  CustomGeneratedInstruction,
  WrappedInstruction,
  accountMetaWithDefault,
} from '../shared';

// Output.
export type PuffMetadataInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountMetadata extends string
        ? WritableAccount<TAccountMetadata>
        : TAccountMetadata
    ]
  >;

export type PuffMetadataInstructionData = { discriminator: number };

export type PuffMetadataInstructionDataArgs = {};

export function getPuffMetadataInstructionDataEncoder(): Encoder<PuffMetadataInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<PuffMetadataInstructionData>(
      [['discriminator', getU8Encoder()]],
      { description: 'PuffMetadataInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 14 } as PuffMetadataInstructionData)
  ) as Encoder<PuffMetadataInstructionDataArgs>;
}

export function getPuffMetadataInstructionDataDecoder(): Decoder<PuffMetadataInstructionData> {
  return getStructDecoder<PuffMetadataInstructionData>(
    [['discriminator', getU8Decoder()]],
    { description: 'PuffMetadataInstructionData' }
  ) as Decoder<PuffMetadataInstructionData>;
}

export function getPuffMetadataInstructionDataCodec(): Codec<
  PuffMetadataInstructionDataArgs,
  PuffMetadataInstructionData
> {
  return combineCodec(
    getPuffMetadataInstructionDataEncoder(),
    getPuffMetadataInstructionDataDecoder()
  );
}

export function puffMetadataInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string
>(
  accounts: {
    metadata: TAccountMetadata extends string
      ? Base58EncodedAddress<TAccountMetadata>
      : TAccountMetadata;
  },
  programAddress: Base58EncodedAddress<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [accountMetaWithDefault(accounts.metadata, AccountRole.WRITABLE)],
    data: getPuffMetadataInstructionDataEncoder().encode({}),
    programAddress,
  } as PuffMetadataInstruction<TProgram, TAccountMetadata>;
}

// Input.
export type PuffMetadataInput<TAccountMetadata extends string> = {
  /** Metadata account */
  metadata: Base58EncodedAddress<TAccountMetadata>;
};

export async function puffMetadata<
  TReturn,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      PuffMetadataInstruction<TProgram, TAccountMetadata>,
      TReturn
    >,
  input: PuffMetadataInput<TAccountMetadata>
): Promise<TReturn>;
export async function puffMetadata<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: PuffMetadataInput<TAccountMetadata>
): Promise<
  WrappedInstruction<PuffMetadataInstruction<TProgram, TAccountMetadata>>
>;
export async function puffMetadata<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string
>(
  input: PuffMetadataInput<TAccountMetadata>
): Promise<
  WrappedInstruction<PuffMetadataInstruction<TProgram, TAccountMetadata>>
>;
export async function puffMetadata<
  TReturn,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          PuffMetadataInstruction<TProgram, TAccountMetadata>,
          TReturn
        >)
    | PuffMetadataInput<TAccountMetadata>,
  rawInput?: PuffMetadataInput<TAccountMetadata>
): Promise<
  | TReturn
  | WrappedInstruction<PuffMetadataInstruction<TProgram, TAccountMetadata>>
> {
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          PuffMetadataInstruction<TProgram, TAccountMetadata>,
          TReturn
        >);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as PuffMetadataInput<TAccountMetadata>;

  const defaultProgramAddress =
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>;
  const programAddress = (
    context.getProgramAddress
      ? await context.getProgramAddress({
          name: 'mplTokenMetadata',
          address: defaultProgramAddress,
        })
      : defaultProgramAddress
  ) as Base58EncodedAddress<TProgram>;

  return {
    instruction: transferSolInstruction(input as any, input, programAddress),
    signers: [],
    bytesCreatedOnChain: 0,
  };
}
