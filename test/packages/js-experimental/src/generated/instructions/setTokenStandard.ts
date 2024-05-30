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

export type SetTokenStandardInstruction<
  TProgram extends string = typeof MPL_TOKEN_METADATA_PROGRAM_ADDRESS,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountEdition extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends readonly IAccountMeta<string>[] = [],
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountMetadata extends string
        ? WritableAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountUpdateAuthority extends string
        ? WritableSignerAccount<TAccountUpdateAuthority> &
            IAccountSignerMeta<TAccountUpdateAuthority>
        : TAccountUpdateAuthority,
      TAccountMint extends string
        ? ReadonlyAccount<TAccountMint>
        : TAccountMint,
      TAccountEdition extends string
        ? ReadonlyAccount<TAccountEdition>
        : TAccountEdition,
      ...TRemainingAccounts,
    ]
  >;

export type SetTokenStandardInstructionData = { discriminator: number };

export type SetTokenStandardInstructionDataArgs = {};

export function getSetTokenStandardInstructionDataEncoder(): Encoder<SetTokenStandardInstructionDataArgs> {
  return transformEncoder(
    getStructEncoder([['discriminator', getU8Encoder()]]),
    (value) => ({ ...value, discriminator: 35 })
  );
}

export function getSetTokenStandardInstructionDataDecoder(): Decoder<SetTokenStandardInstructionData> {
  return getStructDecoder([['discriminator', getU8Decoder()]]);
}

export function getSetTokenStandardInstructionDataCodec(): Codec<
  SetTokenStandardInstructionDataArgs,
  SetTokenStandardInstructionData
> {
  return combineCodec(
    getSetTokenStandardInstructionDataEncoder(),
    getSetTokenStandardInstructionDataDecoder()
  );
}

export type SetTokenStandardInput<
  TAccountMetadata extends string = string,
  TAccountUpdateAuthority extends string = string,
  TAccountMint extends string = string,
  TAccountEdition extends string = string,
> = {
  /** Metadata account */
  metadata: Address<TAccountMetadata>;
  /** Metadata update authority */
  updateAuthority: TransactionSigner<TAccountUpdateAuthority>;
  /** Mint account */
  mint: Address<TAccountMint>;
  /** Edition account */
  edition?: Address<TAccountEdition>;
};

export function getSetTokenStandardInstruction<
  TAccountMetadata extends string,
  TAccountUpdateAuthority extends string,
  TAccountMint extends string,
  TAccountEdition extends string,
>(
  input: SetTokenStandardInput<
    TAccountMetadata,
    TAccountUpdateAuthority,
    TAccountMint,
    TAccountEdition
  >
): SetTokenStandardInstruction<
  typeof MPL_TOKEN_METADATA_PROGRAM_ADDRESS,
  TAccountMetadata,
  TAccountUpdateAuthority,
  TAccountMint,
  TAccountEdition
> {
  // Program address.
  const programAddress = MPL_TOKEN_METADATA_PROGRAM_ADDRESS;

  // Original accounts.
  const originalAccounts = {
    metadata: { value: input.metadata ?? null, isWritable: true },
    updateAuthority: { value: input.updateAuthority ?? null, isWritable: true },
    mint: { value: input.mint ?? null, isWritable: false },
    edition: { value: input.edition ?? null, isWritable: false },
  };
  const accounts = originalAccounts as Record<
    keyof typeof originalAccounts,
    ResolvedAccount
  >;

  const getAccountMeta = getAccountMetaFactory(programAddress, 'programId');
  const instruction = {
    accounts: [
      getAccountMeta(accounts.metadata),
      getAccountMeta(accounts.updateAuthority),
      getAccountMeta(accounts.mint),
      getAccountMeta(accounts.edition),
    ],
    programAddress,
    data: getSetTokenStandardInstructionDataEncoder().encode({}),
  } as SetTokenStandardInstruction<
    typeof MPL_TOKEN_METADATA_PROGRAM_ADDRESS,
    TAccountMetadata,
    TAccountUpdateAuthority,
    TAccountMint,
    TAccountEdition
  >;

  return instruction;
}

export type ParsedSetTokenStandardInstruction<
  TProgram extends string = typeof MPL_TOKEN_METADATA_PROGRAM_ADDRESS,
  TAccountMetas extends readonly IAccountMeta[] = readonly IAccountMeta[],
> = {
  programAddress: Address<TProgram>;
  accounts: {
    /** Metadata account */
    metadata: TAccountMetas[0];
    /** Metadata update authority */
    updateAuthority: TAccountMetas[1];
    /** Mint account */
    mint: TAccountMetas[2];
    /** Edition account */
    edition?: TAccountMetas[3] | undefined;
  };
  data: SetTokenStandardInstructionData;
};

export function parseSetTokenStandardInstruction<
  TProgram extends string,
  TAccountMetas extends readonly IAccountMeta[],
>(
  instruction: IInstruction<TProgram> &
    IInstructionWithAccounts<TAccountMetas> &
    IInstructionWithData<Uint8Array>
): ParsedSetTokenStandardInstruction<TProgram, TAccountMetas> {
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
      metadata: getNextAccount(),
      updateAuthority: getNextAccount(),
      mint: getNextAccount(),
      edition: getNextOptionalAccount(),
    },
    data: getSetTokenStandardInstructionDataDecoder().decode(instruction.data),
  };
}
