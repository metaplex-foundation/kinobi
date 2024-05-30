/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  combineCodec,
  getAddressDecoder,
  getAddressEncoder,
  getBooleanDecoder,
  getBooleanEncoder,
  getOptionDecoder,
  getOptionEncoder,
  getStructDecoder,
  getStructEncoder,
  getU8Decoder,
  getU8Encoder,
  transformEncoder,
  type Address,
  type Codec,
  type Decoder,
  type Encoder,
  type IAccountMeta,
  type IAccountSignerMeta,
  type IInstruction,
  type IInstructionWithAccounts,
  type IInstructionWithData,
  type Option,
  type OptionOrNullable,
  type ReadonlySignerAccount,
  type TransactionSigner,
  type WritableAccount,
} from '@solana/web3.js';
import { MPL_TOKEN_METADATA_PROGRAM_ADDRESS } from '../programs';
import { getAccountMetaFactory, type ResolvedAccount } from '../shared';
import {
  DataV2,
  DataV2Args,
  getDataV2Decoder,
  getDataV2Encoder,
} from '../types';

export type UpdateMetadataAccountV2Instruction<
  TProgram extends string = typeof MPL_TOKEN_METADATA_PROGRAM_ADDRESS,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends readonly IAccountMeta<string>[] = [],
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountMetadata extends string
        ? WritableAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountUpdateAuthority extends string
        ? ReadonlySignerAccount<TAccountUpdateAuthority> &
            IAccountSignerMeta<TAccountUpdateAuthority>
        : TAccountUpdateAuthority,
      ...TRemainingAccounts,
    ]
  >;

export type UpdateMetadataAccountV2InstructionData = {
  discriminator: number;
  data: Option<DataV2>;
  updateAuthority: Option<Address>;
  primarySaleHappened: Option<boolean>;
  isMutable: Option<boolean>;
};

export type UpdateMetadataAccountV2InstructionDataArgs = {
  data: OptionOrNullable<DataV2Args>;
  updateAuthority: OptionOrNullable<Address>;
  primarySaleHappened: OptionOrNullable<boolean>;
  isMutable: OptionOrNullable<boolean>;
};

export function getUpdateMetadataAccountV2InstructionDataEncoder(): Encoder<UpdateMetadataAccountV2InstructionDataArgs> {
  return transformEncoder(
    getStructEncoder([
      ['discriminator', getU8Encoder()],
      ['data', getOptionEncoder(getDataV2Encoder())],
      ['updateAuthority', getOptionEncoder(getAddressEncoder())],
      ['primarySaleHappened', getOptionEncoder(getBooleanEncoder())],
      ['isMutable', getOptionEncoder(getBooleanEncoder())],
    ]),
    (value) => ({ ...value, discriminator: 15 })
  );
}

export function getUpdateMetadataAccountV2InstructionDataDecoder(): Decoder<UpdateMetadataAccountV2InstructionData> {
  return getStructDecoder([
    ['discriminator', getU8Decoder()],
    ['data', getOptionDecoder(getDataV2Decoder())],
    ['updateAuthority', getOptionDecoder(getAddressDecoder())],
    ['primarySaleHappened', getOptionDecoder(getBooleanDecoder())],
    ['isMutable', getOptionDecoder(getBooleanDecoder())],
  ]);
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

export type UpdateMetadataAccountV2Input<
  TAccountMetadata extends string = string,
  TAccountUpdateAuthority extends string = string,
> = {
  /** Metadata account */
  metadata: Address<TAccountMetadata>;
  /** Update authority key */
  updateAuthority: TransactionSigner<TAccountUpdateAuthority>;
  data: UpdateMetadataAccountV2InstructionDataArgs['data'];
  updateAuthorityArg: UpdateMetadataAccountV2InstructionDataArgs['updateAuthority'];
  primarySaleHappened: UpdateMetadataAccountV2InstructionDataArgs['primarySaleHappened'];
  isMutable: UpdateMetadataAccountV2InstructionDataArgs['isMutable'];
};

export function getUpdateMetadataAccountV2Instruction<
  TAccountMetadata extends string,
  TAccountUpdateAuthority extends string,
>(
  input: UpdateMetadataAccountV2Input<TAccountMetadata, TAccountUpdateAuthority>
): UpdateMetadataAccountV2Instruction<
  typeof MPL_TOKEN_METADATA_PROGRAM_ADDRESS,
  TAccountMetadata,
  TAccountUpdateAuthority
> {
  // Program address.
  const programAddress = MPL_TOKEN_METADATA_PROGRAM_ADDRESS;

  // Original accounts.
  const originalAccounts = {
    metadata: { value: input.metadata ?? null, isWritable: true },
    updateAuthority: {
      value: input.updateAuthority ?? null,
      isWritable: false,
    },
  };
  const accounts = originalAccounts as Record<
    keyof typeof originalAccounts,
    ResolvedAccount
  >;

  // Original args.
  const args = { ...input, updateAuthority: input.updateAuthorityArg };

  const getAccountMeta = getAccountMetaFactory(programAddress, 'programId');
  const instruction = {
    accounts: [
      getAccountMeta(accounts.metadata),
      getAccountMeta(accounts.updateAuthority),
    ],
    programAddress,
    data: getUpdateMetadataAccountV2InstructionDataEncoder().encode(
      args as UpdateMetadataAccountV2InstructionDataArgs
    ),
  } as UpdateMetadataAccountV2Instruction<
    typeof MPL_TOKEN_METADATA_PROGRAM_ADDRESS,
    TAccountMetadata,
    TAccountUpdateAuthority
  >;

  return instruction;
}

export type ParsedUpdateMetadataAccountV2Instruction<
  TProgram extends string = typeof MPL_TOKEN_METADATA_PROGRAM_ADDRESS,
  TAccountMetas extends readonly IAccountMeta[] = readonly IAccountMeta[],
> = {
  programAddress: Address<TProgram>;
  accounts: {
    /** Metadata account */
    metadata: TAccountMetas[0];
    /** Update authority key */
    updateAuthority: TAccountMetas[1];
  };
  data: UpdateMetadataAccountV2InstructionData;
};

export function parseUpdateMetadataAccountV2Instruction<
  TProgram extends string,
  TAccountMetas extends readonly IAccountMeta[],
>(
  instruction: IInstruction<TProgram> &
    IInstructionWithAccounts<TAccountMetas> &
    IInstructionWithData<Uint8Array>
): ParsedUpdateMetadataAccountV2Instruction<TProgram, TAccountMetas> {
  if (instruction.accounts.length < 2) {
    // TODO: Coded error.
    throw new Error('Not enough accounts');
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts![accountIndex]!;
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      metadata: getNextAccount(),
      updateAuthority: getNextAccount(),
    },
    data: getUpdateMetadataAccountV2InstructionDataDecoder().decode(
      instruction.data
    ),
  };
}
