/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Address,
  getAddressDecoder,
  getAddressEncoder,
} from '@solana/addresses';
import {
  Codec,
  Decoder,
  Encoder,
  Option,
  OptionOrNullable,
  combineCodec,
  getArrayDecoder,
  getArrayEncoder,
  getBooleanDecoder,
  getBooleanEncoder,
  getOptionDecoder,
  getOptionEncoder,
  getStringDecoder,
  getStringEncoder,
  getStructDecoder,
  getStructEncoder,
  getU16Decoder,
  getU16Encoder,
  getU8Decoder,
  getU8Encoder,
  mapEncoder,
} from '@solana/codecs';
import {
  IAccountMeta,
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  ReadonlySignerAccount,
  WritableAccount,
} from '@solana/instructions';
import { IAccountSignerMeta, TransactionSigner } from '@solana/signers';
import { MPL_TOKEN_METADATA_PROGRAM_ADDRESS } from '../programs';
import { ResolvedAccount, getAccountMetaFactory } from '../shared';
import {
  Creator,
  CreatorArgs,
  getCreatorDecoder,
  getCreatorEncoder,
} from '../types';

export type UpdateMetadataAccountInstruction<
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

export type UpdateMetadataAccountInstructionData = {
  discriminator: number;
  data: Option<{
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: Option<Array<Creator>>;
  }>;
  updateAuthority: Option<Address>;
  primarySaleHappened: Option<boolean>;
};

export type UpdateMetadataAccountInstructionDataArgs = {
  data: OptionOrNullable<{
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: OptionOrNullable<Array<CreatorArgs>>;
  }>;
  updateAuthority: OptionOrNullable<Address>;
  primarySaleHappened: OptionOrNullable<boolean>;
};

export function getUpdateMetadataAccountInstructionDataEncoder(): Encoder<UpdateMetadataAccountInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder([
      ['discriminator', getU8Encoder()],
      [
        'data',
        getOptionEncoder(
          getStructEncoder([
            ['name', getStringEncoder()],
            ['symbol', getStringEncoder()],
            ['uri', getStringEncoder()],
            ['sellerFeeBasisPoints', getU16Encoder()],
            [
              'creators',
              getOptionEncoder(getArrayEncoder(getCreatorEncoder())),
            ],
          ])
        ),
      ],
      ['updateAuthority', getOptionEncoder(getAddressEncoder())],
      ['primarySaleHappened', getOptionEncoder(getBooleanEncoder())],
    ]),
    (value) => ({ ...value, discriminator: 1 })
  );
}

export function getUpdateMetadataAccountInstructionDataDecoder(): Decoder<UpdateMetadataAccountInstructionData> {
  return getStructDecoder([
    ['discriminator', getU8Decoder()],
    [
      'data',
      getOptionDecoder(
        getStructDecoder([
          ['name', getStringDecoder()],
          ['symbol', getStringDecoder()],
          ['uri', getStringDecoder()],
          ['sellerFeeBasisPoints', getU16Decoder()],
          ['creators', getOptionDecoder(getArrayDecoder(getCreatorDecoder()))],
        ])
      ),
    ],
    ['updateAuthority', getOptionDecoder(getAddressDecoder())],
    ['primarySaleHappened', getOptionDecoder(getBooleanDecoder())],
  ]);
}

export function getUpdateMetadataAccountInstructionDataCodec(): Codec<
  UpdateMetadataAccountInstructionDataArgs,
  UpdateMetadataAccountInstructionData
> {
  return combineCodec(
    getUpdateMetadataAccountInstructionDataEncoder(),
    getUpdateMetadataAccountInstructionDataDecoder()
  );
}

export type UpdateMetadataAccountInput<
  TAccountMetadata extends string = string,
  TAccountUpdateAuthority extends string = string,
> = {
  /** Metadata account */
  metadata: Address<TAccountMetadata>;
  /** Update authority key */
  updateAuthority: TransactionSigner<TAccountUpdateAuthority>;
  data: UpdateMetadataAccountInstructionDataArgs['data'];
  updateAuthorityArg: UpdateMetadataAccountInstructionDataArgs['updateAuthority'];
  primarySaleHappened: UpdateMetadataAccountInstructionDataArgs['primarySaleHappened'];
};

export function getUpdateMetadataAccountInstruction<
  TAccountMetadata extends string,
  TAccountUpdateAuthority extends string,
>(
  input: UpdateMetadataAccountInput<TAccountMetadata, TAccountUpdateAuthority>
): UpdateMetadataAccountInstruction<
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
    data: getUpdateMetadataAccountInstructionDataEncoder().encode(
      args as UpdateMetadataAccountInstructionDataArgs
    ),
  } as UpdateMetadataAccountInstruction<
    typeof MPL_TOKEN_METADATA_PROGRAM_ADDRESS,
    TAccountMetadata,
    TAccountUpdateAuthority
  >;

  return instruction;
}

export type ParsedUpdateMetadataAccountInstruction<
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
  data: UpdateMetadataAccountInstructionData;
};

export function parseUpdateMetadataAccountInstruction<
  TProgram extends string,
  TAccountMetas extends readonly IAccountMeta[],
>(
  instruction: IInstruction<TProgram> &
    IInstructionWithAccounts<TAccountMetas> &
    IInstructionWithData<Uint8Array>
): ParsedUpdateMetadataAccountInstruction<TProgram, TAccountMetas> {
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
    data: getUpdateMetadataAccountInstructionDataDecoder().decode(
      instruction.data
    ),
  };
}
