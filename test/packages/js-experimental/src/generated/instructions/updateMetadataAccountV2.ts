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
  getBooleanDecoder,
  getBooleanEncoder,
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
  ReadonlySignerAccount,
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
  Signer,
  WrappedInstruction,
  accountMetaWithDefault,
} from '../shared';
import {
  DataV2,
  DataV2Args,
  getDataV2Decoder,
  getDataV2Encoder,
} from '../types';

// Output.
export type UpdateMetadataAccountV2Instruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountMetadata extends string
        ? WritableAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountUpdateAuthority extends string
        ? ReadonlySignerAccount<TAccountUpdateAuthority>
        : TAccountUpdateAuthority
    ]
  >;

export type UpdateMetadataAccountV2InstructionData = {
  discriminator: number;
  data: Option<DataV2>;
  updateAuthority: Option<Base58EncodedAddress>;
  primarySaleHappened: Option<boolean>;
  isMutable: Option<boolean>;
};

export type UpdateMetadataAccountV2InstructionDataArgs = {
  data: OptionOrNullable<DataV2Args>;
  updateAuthority: OptionOrNullable<Base58EncodedAddress>;
  primarySaleHappened: OptionOrNullable<boolean>;
  isMutable: OptionOrNullable<boolean>;
};

export function getUpdateMetadataAccountV2InstructionDataEncoder(): Encoder<UpdateMetadataAccountV2InstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<UpdateMetadataAccountV2InstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['data', getOptionEncoder(getDataV2Encoder())],
        ['updateAuthority', getOptionEncoder(getAddressEncoder())],
        ['primarySaleHappened', getOptionEncoder(getBooleanEncoder())],
        ['isMutable', getOptionEncoder(getBooleanEncoder())],
      ],
      { description: 'UpdateMetadataAccountV2InstructionData' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: 15,
      } as UpdateMetadataAccountV2InstructionData)
  ) as Encoder<UpdateMetadataAccountV2InstructionDataArgs>;
}

export function getUpdateMetadataAccountV2InstructionDataDecoder(): Decoder<UpdateMetadataAccountV2InstructionData> {
  return getStructDecoder<UpdateMetadataAccountV2InstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['data', getOptionDecoder(getDataV2Decoder())],
      ['updateAuthority', getOptionDecoder(getAddressDecoder())],
      ['primarySaleHappened', getOptionDecoder(getBooleanDecoder())],
      ['isMutable', getOptionDecoder(getBooleanDecoder())],
    ],
    { description: 'UpdateMetadataAccountV2InstructionData' }
  ) as Decoder<UpdateMetadataAccountV2InstructionData>;
}

export function getUpdateMetadataAccountV2InstructionDataCodec(): Codec<
  UpdateMetadataAccountV2InstructionDataArgs,
  UpdateMetadataAccountV2InstructionData
> {
  return combineCodec(
    getUpdateMetadataAccountV2InstructionDataEncoder(),
    getUpdateMetadataAccountV2InstructionDataDecoder()
  );
}

export function updateMetadataAccountV2Instruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string
>(
  accounts: {
    metadata: TAccountMetadata extends string
      ? Base58EncodedAddress<TAccountMetadata>
      : TAccountMetadata;
    updateAuthority: TAccountUpdateAuthority extends string
      ? Base58EncodedAddress<TAccountUpdateAuthority>
      : TAccountUpdateAuthority;
  },
  args: UpdateMetadataAccountV2InstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.metadata, AccountRole.WRITABLE),
      accountMetaWithDefault(
        accounts.updateAuthority,
        AccountRole.READONLY_SIGNER
      ),
    ],
    data: getUpdateMetadataAccountV2InstructionDataEncoder().encode(args),
    programAddress,
  } as UpdateMetadataAccountV2Instruction<
    TProgram,
    TAccountMetadata,
    TAccountUpdateAuthority
  >;
}

// Input.
export type UpdateMetadataAccountV2Input<
  TAccountMetadata extends string,
  TAccountUpdateAuthority extends string
> = {
  /** Metadata account */
  metadata: Base58EncodedAddress<TAccountMetadata>;
  /** Update authority key */
  updateAuthority: Signer<TAccountUpdateAuthority>;
  data: UpdateMetadataAccountV2InstructionDataArgs['data'];
  updateAuthorityArg: UpdateMetadataAccountV2InstructionDataArgs['updateAuthority'];
  primarySaleHappened: UpdateMetadataAccountV2InstructionDataArgs['primarySaleHappened'];
  isMutable: UpdateMetadataAccountV2InstructionDataArgs['isMutable'];
};

export async function updateMetadataAccountV2<
  TReturn,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string,
  TAccountUpdateAuthority extends string = string
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      UpdateMetadataAccountV2Instruction<
        TProgram,
        TAccountMetadata,
        TAccountUpdateAuthority
      >,
      TReturn
    >,
  input: UpdateMetadataAccountV2Input<TAccountMetadata, TAccountUpdateAuthority>
): Promise<TReturn>;
export async function updateMetadataAccountV2<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string,
  TAccountUpdateAuthority extends string = string
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: UpdateMetadataAccountV2Input<TAccountMetadata, TAccountUpdateAuthority>
): Promise<
  WrappedInstruction<
    UpdateMetadataAccountV2Instruction<
      TProgram,
      TAccountMetadata,
      TAccountUpdateAuthority
    >
  >
>;
export async function updateMetadataAccountV2<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string,
  TAccountUpdateAuthority extends string = string
>(
  input: UpdateMetadataAccountV2Input<TAccountMetadata, TAccountUpdateAuthority>
): Promise<
  WrappedInstruction<
    UpdateMetadataAccountV2Instruction<
      TProgram,
      TAccountMetadata,
      TAccountUpdateAuthority
    >
  >
>;
export async function updateMetadataAccountV2<
  TReturn,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string,
  TAccountUpdateAuthority extends string = string
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          UpdateMetadataAccountV2Instruction<
            TProgram,
            TAccountMetadata,
            TAccountUpdateAuthority
          >,
          TReturn
        >)
    | UpdateMetadataAccountV2Input<TAccountMetadata, TAccountUpdateAuthority>,
  rawInput?: UpdateMetadataAccountV2Input<
    TAccountMetadata,
    TAccountUpdateAuthority
  >
): Promise<
  | TReturn
  | WrappedInstruction<
      UpdateMetadataAccountV2Instruction<
        TProgram,
        TAccountMetadata,
        TAccountUpdateAuthority
      >
    >
> {
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          UpdateMetadataAccountV2Instruction<
            TProgram,
            TAccountMetadata,
            TAccountUpdateAuthority
          >,
          TReturn
        >);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as UpdateMetadataAccountV2Input<TAccountMetadata, TAccountUpdateAuthority>;

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
