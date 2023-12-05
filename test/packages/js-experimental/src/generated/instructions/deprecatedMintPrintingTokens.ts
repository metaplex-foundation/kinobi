/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Address } from '@solana/addresses';
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
  ReadonlySignerAccount,
  WritableAccount,
} from '@solana/instructions';
import { IAccountSignerMeta, TransactionSigner } from '@solana/signers';
import {
  Context,
  ResolvedAccount,
  accountMetaWithDefault,
  getAccountMetasWithSigners,
  getProgramAddress,
} from '../shared';
import {
  MintPrintingTokensViaTokenArgs,
  MintPrintingTokensViaTokenArgsArgs,
  getMintPrintingTokensViaTokenArgsDecoder,
  getMintPrintingTokensViaTokenArgsEncoder,
} from '../types';

// Output.
export type DeprecatedMintPrintingTokensInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountDestination extends string | IAccountMeta<string> = string,
  TAccountPrintingMint extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountMasterEdition extends string | IAccountMeta<string> = string,
  TAccountTokenProgram extends
    | string
    | IAccountMeta<string> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountRent extends
    | string
    | IAccountMeta<string> = 'SysvarRent111111111111111111111111111111111',
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountDestination extends string
        ? WritableAccount<TAccountDestination>
        : TAccountDestination,
      TAccountPrintingMint extends string
        ? WritableAccount<TAccountPrintingMint>
        : TAccountPrintingMint,
      TAccountUpdateAuthority extends string
        ? ReadonlySignerAccount<TAccountUpdateAuthority>
        : TAccountUpdateAuthority,
      TAccountMetadata extends string
        ? ReadonlyAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountMasterEdition extends string
        ? ReadonlyAccount<TAccountMasterEdition>
        : TAccountMasterEdition,
      TAccountTokenProgram extends string
        ? ReadonlyAccount<TAccountTokenProgram>
        : TAccountTokenProgram,
      TAccountRent extends string
        ? ReadonlyAccount<TAccountRent>
        : TAccountRent,
      ...TRemainingAccounts
    ]
  >;

// Output.
export type DeprecatedMintPrintingTokensInstructionWithSigners<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountDestination extends string | IAccountMeta<string> = string,
  TAccountPrintingMint extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountMasterEdition extends string | IAccountMeta<string> = string,
  TAccountTokenProgram extends
    | string
    | IAccountMeta<string> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountRent extends
    | string
    | IAccountMeta<string> = 'SysvarRent111111111111111111111111111111111',
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountDestination extends string
        ? WritableAccount<TAccountDestination>
        : TAccountDestination,
      TAccountPrintingMint extends string
        ? WritableAccount<TAccountPrintingMint>
        : TAccountPrintingMint,
      TAccountUpdateAuthority extends string
        ? ReadonlySignerAccount<TAccountUpdateAuthority> &
            IAccountSignerMeta<TAccountUpdateAuthority>
        : TAccountUpdateAuthority,
      TAccountMetadata extends string
        ? ReadonlyAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountMasterEdition extends string
        ? ReadonlyAccount<TAccountMasterEdition>
        : TAccountMasterEdition,
      TAccountTokenProgram extends string
        ? ReadonlyAccount<TAccountTokenProgram>
        : TAccountTokenProgram,
      TAccountRent extends string
        ? ReadonlyAccount<TAccountRent>
        : TAccountRent,
      ...TRemainingAccounts
    ]
  >;

export type DeprecatedMintPrintingTokensInstructionData = {
  discriminator: number;
  mintPrintingTokensViaTokenArgs: MintPrintingTokensViaTokenArgs;
};

export type DeprecatedMintPrintingTokensInstructionDataArgs = {
  mintPrintingTokensViaTokenArgs: MintPrintingTokensViaTokenArgsArgs;
};

export function getDeprecatedMintPrintingTokensInstructionDataEncoder() {
  return mapEncoder(
    getStructEncoder<{
      discriminator: number;
      mintPrintingTokensViaTokenArgs: MintPrintingTokensViaTokenArgsArgs;
    }>([
      ['discriminator', getU8Encoder()],
      [
        'mintPrintingTokensViaTokenArgs',
        getMintPrintingTokensViaTokenArgsEncoder(),
      ],
    ]),
    (value) => ({ ...value, discriminator: 9 })
  ) satisfies Encoder<DeprecatedMintPrintingTokensInstructionDataArgs>;
}

export function getDeprecatedMintPrintingTokensInstructionDataDecoder() {
  return getStructDecoder<DeprecatedMintPrintingTokensInstructionData>([
    ['discriminator', getU8Decoder()],
    [
      'mintPrintingTokensViaTokenArgs',
      getMintPrintingTokensViaTokenArgsDecoder(),
    ],
  ]) satisfies Decoder<DeprecatedMintPrintingTokensInstructionData>;
}

export function getDeprecatedMintPrintingTokensInstructionDataCodec(): Codec<
  DeprecatedMintPrintingTokensInstructionDataArgs,
  DeprecatedMintPrintingTokensInstructionData
> {
  return combineCodec(
    getDeprecatedMintPrintingTokensInstructionDataEncoder(),
    getDeprecatedMintPrintingTokensInstructionDataDecoder()
  );
}

export type DeprecatedMintPrintingTokensInput<
  TAccountDestination extends string,
  TAccountPrintingMint extends string,
  TAccountUpdateAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountTokenProgram extends string,
  TAccountRent extends string
> = {
  /** Destination account */
  destination: Address<TAccountDestination>;
  /** Printing mint */
  printingMint: Address<TAccountPrintingMint>;
  /** Update authority */
  updateAuthority: Address<TAccountUpdateAuthority>;
  /** Metadata key (pda of ['metadata', program id, mint id]) */
  metadata: Address<TAccountMetadata>;
  /** Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition']) */
  masterEdition: Address<TAccountMasterEdition>;
  /** Token program */
  tokenProgram?: Address<TAccountTokenProgram>;
  /** Rent */
  rent?: Address<TAccountRent>;
  mintPrintingTokensViaTokenArgs: DeprecatedMintPrintingTokensInstructionDataArgs['mintPrintingTokensViaTokenArgs'];
};

export type DeprecatedMintPrintingTokensInputWithSigners<
  TAccountDestination extends string,
  TAccountPrintingMint extends string,
  TAccountUpdateAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountTokenProgram extends string,
  TAccountRent extends string
> = {
  /** Destination account */
  destination: Address<TAccountDestination>;
  /** Printing mint */
  printingMint: Address<TAccountPrintingMint>;
  /** Update authority */
  updateAuthority: TransactionSigner<TAccountUpdateAuthority>;
  /** Metadata key (pda of ['metadata', program id, mint id]) */
  metadata: Address<TAccountMetadata>;
  /** Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition']) */
  masterEdition: Address<TAccountMasterEdition>;
  /** Token program */
  tokenProgram?: Address<TAccountTokenProgram>;
  /** Rent */
  rent?: Address<TAccountRent>;
  mintPrintingTokensViaTokenArgs: DeprecatedMintPrintingTokensInstructionDataArgs['mintPrintingTokensViaTokenArgs'];
};

export function getDeprecatedMintPrintingTokensInstruction<
  TAccountDestination extends string,
  TAccountPrintingMint extends string,
  TAccountUpdateAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountTokenProgram extends string,
  TAccountRent extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: DeprecatedMintPrintingTokensInputWithSigners<
    TAccountDestination,
    TAccountPrintingMint,
    TAccountUpdateAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenProgram,
    TAccountRent
  >
): DeprecatedMintPrintingTokensInstructionWithSigners<
  TProgram,
  TAccountDestination,
  TAccountPrintingMint,
  TAccountUpdateAuthority,
  TAccountMetadata,
  TAccountMasterEdition,
  TAccountTokenProgram,
  TAccountRent
>;
export function getDeprecatedMintPrintingTokensInstruction<
  TAccountDestination extends string,
  TAccountPrintingMint extends string,
  TAccountUpdateAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountTokenProgram extends string,
  TAccountRent extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: DeprecatedMintPrintingTokensInput<
    TAccountDestination,
    TAccountPrintingMint,
    TAccountUpdateAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenProgram,
    TAccountRent
  >
): DeprecatedMintPrintingTokensInstruction<
  TProgram,
  TAccountDestination,
  TAccountPrintingMint,
  TAccountUpdateAuthority,
  TAccountMetadata,
  TAccountMasterEdition,
  TAccountTokenProgram,
  TAccountRent
>;
export function getDeprecatedMintPrintingTokensInstruction<
  TAccountDestination extends string,
  TAccountPrintingMint extends string,
  TAccountUpdateAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountTokenProgram extends string,
  TAccountRent extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  input: DeprecatedMintPrintingTokensInputWithSigners<
    TAccountDestination,
    TAccountPrintingMint,
    TAccountUpdateAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenProgram,
    TAccountRent
  >
): DeprecatedMintPrintingTokensInstructionWithSigners<
  TProgram,
  TAccountDestination,
  TAccountPrintingMint,
  TAccountUpdateAuthority,
  TAccountMetadata,
  TAccountMasterEdition,
  TAccountTokenProgram,
  TAccountRent
>;
export function getDeprecatedMintPrintingTokensInstruction<
  TAccountDestination extends string,
  TAccountPrintingMint extends string,
  TAccountUpdateAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountTokenProgram extends string,
  TAccountRent extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  input: DeprecatedMintPrintingTokensInput<
    TAccountDestination,
    TAccountPrintingMint,
    TAccountUpdateAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenProgram,
    TAccountRent
  >
): DeprecatedMintPrintingTokensInstruction<
  TProgram,
  TAccountDestination,
  TAccountPrintingMint,
  TAccountUpdateAuthority,
  TAccountMetadata,
  TAccountMasterEdition,
  TAccountTokenProgram,
  TAccountRent
>;
export function getDeprecatedMintPrintingTokensInstruction<
  TAccountDestination extends string,
  TAccountPrintingMint extends string,
  TAccountUpdateAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountTokenProgram extends string,
  TAccountRent extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | DeprecatedMintPrintingTokensInput<
        TAccountDestination,
        TAccountPrintingMint,
        TAccountUpdateAuthority,
        TAccountMetadata,
        TAccountMasterEdition,
        TAccountTokenProgram,
        TAccountRent
      >,
  rawInput?: DeprecatedMintPrintingTokensInput<
    TAccountDestination,
    TAccountPrintingMint,
    TAccountUpdateAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenProgram,
    TAccountRent
  >
): IInstruction {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawContext) as Pick<
    Context,
    'getProgramAddress'
  >;
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as DeprecatedMintPrintingTokensInput<
    TAccountDestination,
    TAccountPrintingMint,
    TAccountUpdateAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenProgram,
    TAccountRent
  >;

  // Program address.
  const defaultProgramAddress =
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>;
  const programAddress = (
    context.getProgramAddress
      ? context.getProgramAddress({
          name: 'mplTokenMetadata',
          address: defaultProgramAddress,
        })
      : defaultProgramAddress
  ) as Address<TProgram>;

  // Original accounts.
  type AccountMetas = Parameters<
    typeof getDeprecatedMintPrintingTokensInstructionRaw<
      TProgram,
      TAccountDestination,
      TAccountPrintingMint,
      TAccountUpdateAuthority,
      TAccountMetadata,
      TAccountMasterEdition,
      TAccountTokenProgram,
      TAccountRent
    >
  >[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    destination: { value: input.destination ?? null, isWritable: true },
    printingMint: { value: input.printingMint ?? null, isWritable: true },
    updateAuthority: {
      value: input.updateAuthority ?? null,
      isWritable: false,
    },
    metadata: { value: input.metadata ?? null, isWritable: false },
    masterEdition: { value: input.masterEdition ?? null, isWritable: false },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false },
    rent: { value: input.rent ?? null, isWritable: false },
  };

  // Original args.
  const args = { ...input };

  // Resolve default values.
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value = getProgramAddress(
      context,
      'splToken',
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    );
    accounts.tokenProgram.isWritable = false;
  }
  if (!accounts.rent.value) {
    accounts.rent.value =
      'SysvarRent111111111111111111111111111111111' as Address<'SysvarRent111111111111111111111111111111111'>;
  }

  // Get account metas and signers.
  const accountMetas = getAccountMetasWithSigners(
    accounts,
    'programId',
    programAddress
  );

  // Remaining accounts.
  const remainingAccounts: IAccountMeta[] = [];

  // Bytes created on chain.
  const bytesCreatedOnChain = 0;

  return Object.freeze({
    ...getDeprecatedMintPrintingTokensInstructionRaw(
      accountMetas as Record<keyof AccountMetas, IAccountMeta>,
      args as DeprecatedMintPrintingTokensInstructionDataArgs,
      programAddress,
      remainingAccounts
    ),
    bytesCreatedOnChain,
  });
}

export function getDeprecatedMintPrintingTokensInstructionRaw<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountDestination extends string | IAccountMeta<string> = string,
  TAccountPrintingMint extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountMasterEdition extends string | IAccountMeta<string> = string,
  TAccountTokenProgram extends
    | string
    | IAccountMeta<string> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountRent extends
    | string
    | IAccountMeta<string> = 'SysvarRent111111111111111111111111111111111',
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
>(
  accounts: {
    destination: TAccountDestination extends string
      ? Address<TAccountDestination>
      : TAccountDestination;
    printingMint: TAccountPrintingMint extends string
      ? Address<TAccountPrintingMint>
      : TAccountPrintingMint;
    updateAuthority: TAccountUpdateAuthority extends string
      ? Address<TAccountUpdateAuthority>
      : TAccountUpdateAuthority;
    metadata: TAccountMetadata extends string
      ? Address<TAccountMetadata>
      : TAccountMetadata;
    masterEdition: TAccountMasterEdition extends string
      ? Address<TAccountMasterEdition>
      : TAccountMasterEdition;
    tokenProgram?: TAccountTokenProgram extends string
      ? Address<TAccountTokenProgram>
      : TAccountTokenProgram;
    rent?: TAccountRent extends string ? Address<TAccountRent> : TAccountRent;
  },
  args: DeprecatedMintPrintingTokensInstructionDataArgs,
  programAddress: Address<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<TProgram>,
  remainingAccounts?: TRemainingAccounts
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.destination, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.printingMint, AccountRole.WRITABLE),
      accountMetaWithDefault(
        accounts.updateAuthority,
        AccountRole.READONLY_SIGNER
      ),
      accountMetaWithDefault(accounts.metadata, AccountRole.READONLY),
      accountMetaWithDefault(accounts.masterEdition, AccountRole.READONLY),
      accountMetaWithDefault(
        accounts.tokenProgram ?? {
          address:
            'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Address<'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
      accountMetaWithDefault(
        accounts.rent ?? 'SysvarRent111111111111111111111111111111111',
        AccountRole.READONLY
      ),
      ...(remainingAccounts ?? []),
    ],
    data: getDeprecatedMintPrintingTokensInstructionDataEncoder().encode(args),
    programAddress,
  } as DeprecatedMintPrintingTokensInstruction<
    TProgram,
    TAccountDestination,
    TAccountPrintingMint,
    TAccountUpdateAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenProgram,
    TAccountRent,
    TRemainingAccounts
  >;
}
