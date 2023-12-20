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
  combineCodec,
  mapEncoder,
} from '@solana/codecs-core';
import {
  getArrayDecoder,
  getArrayEncoder,
  getBooleanDecoder,
  getBooleanEncoder,
  getStructDecoder,
  getStructEncoder,
} from '@solana/codecs-data-structures';
import {
  getU16Decoder,
  getU16Encoder,
  getU8Decoder,
  getU8Encoder,
} from '@solana/codecs-numbers';
import { getStringDecoder, getStringEncoder } from '@solana/codecs-strings';
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
import { IAccountSignerMeta, TransactionSigner } from '@solana/signers';
import {
  ResolvedAccount,
  accountMetaWithDefault,
  getAccountMetasWithSigners,
} from '../shared';
import {
  Creator,
  CreatorArgs,
  getCreatorDecoder,
  getCreatorEncoder,
} from '../types';

export type UpdateMetadataAccountInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountMetadata extends string
        ? WritableAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountUpdateAuthority extends string
        ? ReadonlySignerAccount<TAccountUpdateAuthority>
        : TAccountUpdateAuthority,
      ...TRemainingAccounts
    ]
  >;

export type UpdateMetadataAccountInstructionWithSigners<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
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
      ...TRemainingAccounts
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

export function getUpdateMetadataAccountInstructionDataEncoder() {
  return mapEncoder(
    getStructEncoder<{
      discriminator: number;
      data: OptionOrNullable<{
        name: string;
        symbol: string;
        uri: string;
        sellerFeeBasisPoints: number;
        creators: OptionOrNullable<Array<CreatorArgs>>;
      }>;
      updateAuthority: OptionOrNullable<Address>;
      primarySaleHappened: OptionOrNullable<boolean>;
    }>([
      ['discriminator', getU8Encoder()],
      [
        'data',
        getOptionEncoder(
          getStructEncoder<{
            name: string;
            symbol: string;
            uri: string;
            sellerFeeBasisPoints: number;
            creators: OptionOrNullable<Array<CreatorArgs>>;
          }>([
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
  ) satisfies Encoder<UpdateMetadataAccountInstructionDataArgs>;
}

export function getUpdateMetadataAccountInstructionDataDecoder() {
  return getStructDecoder<UpdateMetadataAccountInstructionData>([
    ['discriminator', getU8Decoder()],
    [
      'data',
      getOptionDecoder(
        getStructDecoder<{
          name: string;
          symbol: string;
          uri: string;
          sellerFeeBasisPoints: number;
          creators: Option<Array<Creator>>;
        }>([
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
  ]) satisfies Decoder<UpdateMetadataAccountInstructionData>;
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
  TAccountMetadata extends string,
  TAccountUpdateAuthority extends string
> = {
  /** Metadata account */
  metadata: Address<TAccountMetadata>;
  /** Update authority key */
  updateAuthority: Address<TAccountUpdateAuthority>;
  data: UpdateMetadataAccountInstructionDataArgs['data'];
  updateAuthorityArg: UpdateMetadataAccountInstructionDataArgs['updateAuthority'];
  primarySaleHappened: UpdateMetadataAccountInstructionDataArgs['primarySaleHappened'];
};

export type UpdateMetadataAccountInputWithSigners<
  TAccountMetadata extends string,
  TAccountUpdateAuthority extends string
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
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  input: UpdateMetadataAccountInputWithSigners<
    TAccountMetadata,
    TAccountUpdateAuthority
  >
): UpdateMetadataAccountInstructionWithSigners<
  TProgram,
  TAccountMetadata,
  TAccountUpdateAuthority
>;
export function getUpdateMetadataAccountInstruction<
  TAccountMetadata extends string,
  TAccountUpdateAuthority extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  input: UpdateMetadataAccountInput<TAccountMetadata, TAccountUpdateAuthority>
): UpdateMetadataAccountInstruction<
  TProgram,
  TAccountMetadata,
  TAccountUpdateAuthority
>;
export function getUpdateMetadataAccountInstruction<
  TAccountMetadata extends string,
  TAccountUpdateAuthority extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  input: UpdateMetadataAccountInput<TAccountMetadata, TAccountUpdateAuthority>
): IInstruction {
  // Program address.
  const programAddress =
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>;

  // Original accounts.
  type AccountMetas = Parameters<
    typeof getUpdateMetadataAccountInstructionRaw<
      TProgram,
      TAccountMetadata,
      TAccountUpdateAuthority
    >
  >[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    metadata: { value: input.metadata ?? null, isWritable: true },
    updateAuthority: {
      value: input.updateAuthority ?? null,
      isWritable: false,
    },
  };

  // Original args.
  const args = { ...input, updateAuthority: input.updateAuthorityArg };

  // Get account metas and signers.
  const accountMetas = getAccountMetasWithSigners(
    accounts,
    'programId',
    programAddress
  );

  const instruction = getUpdateMetadataAccountInstructionRaw(
    accountMetas as Record<keyof AccountMetas, IAccountMeta>,
    args as UpdateMetadataAccountInstructionDataArgs,
    programAddress
  );

  return instruction;
}

export function getUpdateMetadataAccountInstructionRaw<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
>(
  accounts: {
    metadata: TAccountMetadata extends string
      ? Address<TAccountMetadata>
      : TAccountMetadata;
    updateAuthority: TAccountUpdateAuthority extends string
      ? Address<TAccountUpdateAuthority>
      : TAccountUpdateAuthority;
  },
  args: UpdateMetadataAccountInstructionDataArgs,
  programAddress: Address<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<TProgram>,
  remainingAccounts?: TRemainingAccounts
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.metadata, AccountRole.WRITABLE),
      accountMetaWithDefault(
        accounts.updateAuthority,
        AccountRole.READONLY_SIGNER
      ),
      ...(remainingAccounts ?? []),
    ],
    data: getUpdateMetadataAccountInstructionDataEncoder().encode(args),
    programAddress,
  } as UpdateMetadataAccountInstruction<
    TProgram,
    TAccountMetadata,
    TAccountUpdateAuthority,
    TRemainingAccounts
  >;
}

export type ParsedUpdateMetadataAccountInstruction = {
  accounts: {};
  data: UpdateMetadataAccountInstructionData;
};

export function parseUpdateMetadataAccountInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  instruction: IInstruction<TProgram> & IInstructionWithData<Uint8Array>
): ParsedUpdateMetadataAccountInstruction {
  if (!instruction.accounts || instruction.accounts.length < 2) {
    // TODO: Coded error.
    throw new Error('Not enough accounts');
  }
  let accountIndex = 0;
  return {
    accounts: {},
    data: getUpdateMetadataAccountInstructionDataDecoder().decode(
      instruction.data
    ),
  };
}
