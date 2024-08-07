/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  combineCodec,
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
  type ReadonlyAccount,
  type TransactionSigner,
  type WritableAccount,
  type WritableSignerAccount,
} from '@solana/web3.js';
import { MPL_TOKEN_METADATA_PROGRAM_ADDRESS } from '../programs';
import { getAccountMetaFactory, type ResolvedAccount } from '../shared';
import {
  getSetCollectionSizeArgsDecoder,
  getSetCollectionSizeArgsEncoder,
  type SetCollectionSizeArgs,
  type SetCollectionSizeArgsArgs,
} from '../types';

export type SetCollectionSizeInstruction<
  TProgram extends string = typeof MPL_TOKEN_METADATA_PROGRAM_ADDRESS,
  TAccountCollectionMetadata extends string | IAccountMeta<string> = string,
  TAccountCollectionAuthority extends string | IAccountMeta<string> = string,
  TAccountCollectionMint extends string | IAccountMeta<string> = string,
  TAccountCollectionAuthorityRecord extends
    | string
    | IAccountMeta<string> = string,
  TRemainingAccounts extends readonly IAccountMeta<string>[] = [],
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountCollectionMetadata extends string
        ? WritableAccount<TAccountCollectionMetadata>
        : TAccountCollectionMetadata,
      TAccountCollectionAuthority extends string
        ? WritableSignerAccount<TAccountCollectionAuthority> &
            IAccountSignerMeta<TAccountCollectionAuthority>
        : TAccountCollectionAuthority,
      TAccountCollectionMint extends string
        ? ReadonlyAccount<TAccountCollectionMint>
        : TAccountCollectionMint,
      TAccountCollectionAuthorityRecord extends string
        ? ReadonlyAccount<TAccountCollectionAuthorityRecord>
        : TAccountCollectionAuthorityRecord,
      ...TRemainingAccounts,
    ]
  >;

export type SetCollectionSizeInstructionData = {
  discriminator: number;
  setCollectionSizeArgs: SetCollectionSizeArgs;
};

export type SetCollectionSizeInstructionDataArgs = {
  setCollectionSizeArgs: SetCollectionSizeArgsArgs;
};

export function getSetCollectionSizeInstructionDataEncoder(): Encoder<SetCollectionSizeInstructionDataArgs> {
  return transformEncoder(
    getStructEncoder([
      ['discriminator', getU8Encoder()],
      ['setCollectionSizeArgs', getSetCollectionSizeArgsEncoder()],
    ]),
    (value) => ({ ...value, discriminator: 34 })
  );
}

export function getSetCollectionSizeInstructionDataDecoder(): Decoder<SetCollectionSizeInstructionData> {
  return getStructDecoder([
    ['discriminator', getU8Decoder()],
    ['setCollectionSizeArgs', getSetCollectionSizeArgsDecoder()],
  ]);
}

export function getSetCollectionSizeInstructionDataCodec(): Codec<
  SetCollectionSizeInstructionDataArgs,
  SetCollectionSizeInstructionData
> {
  return combineCodec(
    getSetCollectionSizeInstructionDataEncoder(),
    getSetCollectionSizeInstructionDataDecoder()
  );
}

export type SetCollectionSizeInput<
  TAccountCollectionMetadata extends string = string,
  TAccountCollectionAuthority extends string = string,
  TAccountCollectionMint extends string = string,
  TAccountCollectionAuthorityRecord extends string = string,
> = {
  /** Collection Metadata account */
  collectionMetadata: Address<TAccountCollectionMetadata>;
  /** Collection Update authority */
  collectionAuthority: TransactionSigner<TAccountCollectionAuthority>;
  /** Mint of the Collection */
  collectionMint: Address<TAccountCollectionMint>;
  /** Collection Authority Record PDA */
  collectionAuthorityRecord?: Address<TAccountCollectionAuthorityRecord>;
  setCollectionSizeArgs: SetCollectionSizeInstructionDataArgs['setCollectionSizeArgs'];
};

export function getSetCollectionSizeInstruction<
  TAccountCollectionMetadata extends string,
  TAccountCollectionAuthority extends string,
  TAccountCollectionMint extends string,
  TAccountCollectionAuthorityRecord extends string,
>(
  input: SetCollectionSizeInput<
    TAccountCollectionMetadata,
    TAccountCollectionAuthority,
    TAccountCollectionMint,
    TAccountCollectionAuthorityRecord
  >
): SetCollectionSizeInstruction<
  typeof MPL_TOKEN_METADATA_PROGRAM_ADDRESS,
  TAccountCollectionMetadata,
  TAccountCollectionAuthority,
  TAccountCollectionMint,
  TAccountCollectionAuthorityRecord
> {
  // Program address.
  const programAddress = MPL_TOKEN_METADATA_PROGRAM_ADDRESS;

  // Original accounts.
  const originalAccounts = {
    collectionMetadata: {
      value: input.collectionMetadata ?? null,
      isWritable: true,
    },
    collectionAuthority: {
      value: input.collectionAuthority ?? null,
      isWritable: true,
    },
    collectionMint: { value: input.collectionMint ?? null, isWritable: false },
    collectionAuthorityRecord: {
      value: input.collectionAuthorityRecord ?? null,
      isWritable: false,
    },
  };
  const accounts = originalAccounts as Record<
    keyof typeof originalAccounts,
    ResolvedAccount
  >;

  // Original args.
  const args = { ...input };

  const getAccountMeta = getAccountMetaFactory(programAddress, 'programId');
  const instruction = {
    accounts: [
      getAccountMeta(accounts.collectionMetadata),
      getAccountMeta(accounts.collectionAuthority),
      getAccountMeta(accounts.collectionMint),
      getAccountMeta(accounts.collectionAuthorityRecord),
    ],
    programAddress,
    data: getSetCollectionSizeInstructionDataEncoder().encode(
      args as SetCollectionSizeInstructionDataArgs
    ),
  } as SetCollectionSizeInstruction<
    typeof MPL_TOKEN_METADATA_PROGRAM_ADDRESS,
    TAccountCollectionMetadata,
    TAccountCollectionAuthority,
    TAccountCollectionMint,
    TAccountCollectionAuthorityRecord
  >;

  return instruction;
}

export type ParsedSetCollectionSizeInstruction<
  TProgram extends string = typeof MPL_TOKEN_METADATA_PROGRAM_ADDRESS,
  TAccountMetas extends readonly IAccountMeta[] = readonly IAccountMeta[],
> = {
  programAddress: Address<TProgram>;
  accounts: {
    /** Collection Metadata account */
    collectionMetadata: TAccountMetas[0];
    /** Collection Update authority */
    collectionAuthority: TAccountMetas[1];
    /** Mint of the Collection */
    collectionMint: TAccountMetas[2];
    /** Collection Authority Record PDA */
    collectionAuthorityRecord?: TAccountMetas[3] | undefined;
  };
  data: SetCollectionSizeInstructionData;
};

export function parseSetCollectionSizeInstruction<
  TProgram extends string,
  TAccountMetas extends readonly IAccountMeta[],
>(
  instruction: IInstruction<TProgram> &
    IInstructionWithAccounts<TAccountMetas> &
    IInstructionWithData<Uint8Array>
): ParsedSetCollectionSizeInstruction<TProgram, TAccountMetas> {
  if (instruction.accounts.length < 4) {
    // TODO: Coded error.
    throw new Error('Not enough accounts');
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts![accountIndex]!;
    accountIndex += 1;
    return accountMeta;
  };
  const getNextOptionalAccount = () => {
    const accountMeta = getNextAccount();
    return accountMeta.address === MPL_TOKEN_METADATA_PROGRAM_ADDRESS
      ? undefined
      : accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      collectionMetadata: getNextAccount(),
      collectionAuthority: getNextAccount(),
      collectionMint: getNextAccount(),
      collectionAuthorityRecord: getNextOptionalAccount(),
    },
    data: getSetCollectionSizeInstructionDataDecoder().decode(instruction.data),
  };
}
