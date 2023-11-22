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
import {
  IAccountSignerMeta,
  IInstructionWithSigners,
  TransactionSigner,
} from '@solana/signers';
import {
  Context,
  CustomGeneratedInstruction,
  IInstructionWithBytesCreatedOnChain,
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
export type DeprecatedMintPrintingTokensViaTokenInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountDestination extends string | IAccountMeta<string> = string,
  TAccountToken extends string | IAccountMeta<string> = string,
  TAccountOneTimePrintingAuthorizationMint extends
    | string
    | IAccountMeta<string> = string,
  TAccountPrintingMint extends string | IAccountMeta<string> = string,
  TAccountBurnAuthority extends string | IAccountMeta<string> = string,
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
      TAccountToken extends string
        ? WritableAccount<TAccountToken>
        : TAccountToken,
      TAccountOneTimePrintingAuthorizationMint extends string
        ? WritableAccount<TAccountOneTimePrintingAuthorizationMint>
        : TAccountOneTimePrintingAuthorizationMint,
      TAccountPrintingMint extends string
        ? WritableAccount<TAccountPrintingMint>
        : TAccountPrintingMint,
      TAccountBurnAuthority extends string
        ? ReadonlySignerAccount<TAccountBurnAuthority>
        : TAccountBurnAuthority,
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

export type DeprecatedMintPrintingTokensViaTokenInstructionData = {
  discriminator: number;
  mintPrintingTokensViaTokenArgs: MintPrintingTokensViaTokenArgs;
};

export type DeprecatedMintPrintingTokensViaTokenInstructionDataArgs = {
  mintPrintingTokensViaTokenArgs: MintPrintingTokensViaTokenArgsArgs;
};

export function getDeprecatedMintPrintingTokensViaTokenInstructionDataEncoder(): Encoder<DeprecatedMintPrintingTokensViaTokenInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<{
      discriminator: number;
      mintPrintingTokensViaTokenArgs: MintPrintingTokensViaTokenArgsArgs;
    }>(
      [
        ['discriminator', getU8Encoder()],
        [
          'mintPrintingTokensViaTokenArgs',
          getMintPrintingTokensViaTokenArgsEncoder(),
        ],
      ],
      { description: 'DeprecatedMintPrintingTokensViaTokenInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 8 })
  ) as Encoder<DeprecatedMintPrintingTokensViaTokenInstructionDataArgs>;
}

export function getDeprecatedMintPrintingTokensViaTokenInstructionDataDecoder(): Decoder<DeprecatedMintPrintingTokensViaTokenInstructionData> {
  return getStructDecoder<DeprecatedMintPrintingTokensViaTokenInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      [
        'mintPrintingTokensViaTokenArgs',
        getMintPrintingTokensViaTokenArgsDecoder(),
      ],
    ],
    { description: 'DeprecatedMintPrintingTokensViaTokenInstructionData' }
  ) as Decoder<DeprecatedMintPrintingTokensViaTokenInstructionData>;
}

export function getDeprecatedMintPrintingTokensViaTokenInstructionDataCodec(): Codec<
  DeprecatedMintPrintingTokensViaTokenInstructionDataArgs,
  DeprecatedMintPrintingTokensViaTokenInstructionData
> {
  return combineCodec(
    getDeprecatedMintPrintingTokensViaTokenInstructionDataEncoder(),
    getDeprecatedMintPrintingTokensViaTokenInstructionDataDecoder()
  );
}

export function deprecatedMintPrintingTokensViaTokenInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountDestination extends string | IAccountMeta<string> = string,
  TAccountToken extends string | IAccountMeta<string> = string,
  TAccountOneTimePrintingAuthorizationMint extends
    | string
    | IAccountMeta<string> = string,
  TAccountPrintingMint extends string | IAccountMeta<string> = string,
  TAccountBurnAuthority extends string | IAccountMeta<string> = string,
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
    token: TAccountToken extends string
      ? Address<TAccountToken>
      : TAccountToken;
    oneTimePrintingAuthorizationMint: TAccountOneTimePrintingAuthorizationMint extends string
      ? Address<TAccountOneTimePrintingAuthorizationMint>
      : TAccountOneTimePrintingAuthorizationMint;
    printingMint: TAccountPrintingMint extends string
      ? Address<TAccountPrintingMint>
      : TAccountPrintingMint;
    burnAuthority: TAccountBurnAuthority extends string
      ? Address<TAccountBurnAuthority>
      : TAccountBurnAuthority;
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
  args: DeprecatedMintPrintingTokensViaTokenInstructionDataArgs,
  programAddress: Address<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<TProgram>,
  remainingAccounts?: TRemainingAccounts
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.destination, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.token, AccountRole.WRITABLE),
      accountMetaWithDefault(
        accounts.oneTimePrintingAuthorizationMint,
        AccountRole.WRITABLE
      ),
      accountMetaWithDefault(accounts.printingMint, AccountRole.WRITABLE),
      accountMetaWithDefault(
        accounts.burnAuthority,
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
    data: getDeprecatedMintPrintingTokensViaTokenInstructionDataEncoder().encode(
      args
    ),
    programAddress,
  } as DeprecatedMintPrintingTokensViaTokenInstruction<
    TProgram,
    TAccountDestination,
    TAccountToken,
    TAccountOneTimePrintingAuthorizationMint,
    TAccountPrintingMint,
    TAccountBurnAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenProgram,
    TAccountRent,
    TRemainingAccounts
  >;
}

// Input.
export type DeprecatedMintPrintingTokensViaTokenInput<
  TAccountDestination extends string,
  TAccountToken extends string,
  TAccountOneTimePrintingAuthorizationMint extends string,
  TAccountPrintingMint extends string,
  TAccountBurnAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountTokenProgram extends string,
  TAccountRent extends string
> = {
  /** Destination account */
  destination: Address<TAccountDestination>;
  /** Token account containing one time authorization token */
  token: Address<TAccountToken>;
  /** One time authorization mint */
  oneTimePrintingAuthorizationMint: Address<TAccountOneTimePrintingAuthorizationMint>;
  /** Printing mint */
  printingMint: Address<TAccountPrintingMint>;
  /** Burn authority */
  burnAuthority: TransactionSigner<TAccountBurnAuthority>;
  /** Metadata key (pda of ['metadata', program id, mint id]) */
  metadata: Address<TAccountMetadata>;
  /** Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition']) */
  masterEdition: Address<TAccountMasterEdition>;
  /** Token program */
  tokenProgram?: Address<TAccountTokenProgram>;
  /** Rent */
  rent?: Address<TAccountRent>;
  mintPrintingTokensViaTokenArgs: DeprecatedMintPrintingTokensViaTokenInstructionDataArgs['mintPrintingTokensViaTokenArgs'];
};

export async function deprecatedMintPrintingTokensViaToken<
  TReturn,
  TAccountDestination extends string,
  TAccountToken extends string,
  TAccountOneTimePrintingAuthorizationMint extends string,
  TAccountPrintingMint extends string,
  TAccountBurnAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountTokenProgram extends string,
  TAccountRent extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      DeprecatedMintPrintingTokensViaTokenInstruction<
        TProgram,
        TAccountDestination,
        TAccountToken,
        TAccountOneTimePrintingAuthorizationMint,
        TAccountPrintingMint,
        ReadonlySignerAccount<TAccountBurnAuthority> &
          IAccountSignerMeta<TAccountBurnAuthority>,
        TAccountMetadata,
        TAccountMasterEdition,
        TAccountTokenProgram,
        TAccountRent
      >,
      TReturn
    >,
  input: DeprecatedMintPrintingTokensViaTokenInput<
    TAccountDestination,
    TAccountToken,
    TAccountOneTimePrintingAuthorizationMint,
    TAccountPrintingMint,
    TAccountBurnAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenProgram,
    TAccountRent
  >
): Promise<TReturn>;
export async function deprecatedMintPrintingTokensViaToken<
  TAccountDestination extends string,
  TAccountToken extends string,
  TAccountOneTimePrintingAuthorizationMint extends string,
  TAccountPrintingMint extends string,
  TAccountBurnAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountTokenProgram extends string,
  TAccountRent extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: DeprecatedMintPrintingTokensViaTokenInput<
    TAccountDestination,
    TAccountToken,
    TAccountOneTimePrintingAuthorizationMint,
    TAccountPrintingMint,
    TAccountBurnAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenProgram,
    TAccountRent
  >
): Promise<
  DeprecatedMintPrintingTokensViaTokenInstruction<
    TProgram,
    TAccountDestination,
    TAccountToken,
    TAccountOneTimePrintingAuthorizationMint,
    TAccountPrintingMint,
    ReadonlySignerAccount<TAccountBurnAuthority> &
      IAccountSignerMeta<TAccountBurnAuthority>,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenProgram,
    TAccountRent
  > &
    IInstructionWithSigners &
    IInstructionWithBytesCreatedOnChain
>;
export async function deprecatedMintPrintingTokensViaToken<
  TAccountDestination extends string,
  TAccountToken extends string,
  TAccountOneTimePrintingAuthorizationMint extends string,
  TAccountPrintingMint extends string,
  TAccountBurnAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountTokenProgram extends string,
  TAccountRent extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  input: DeprecatedMintPrintingTokensViaTokenInput<
    TAccountDestination,
    TAccountToken,
    TAccountOneTimePrintingAuthorizationMint,
    TAccountPrintingMint,
    TAccountBurnAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenProgram,
    TAccountRent
  >
): Promise<
  DeprecatedMintPrintingTokensViaTokenInstruction<
    TProgram,
    TAccountDestination,
    TAccountToken,
    TAccountOneTimePrintingAuthorizationMint,
    TAccountPrintingMint,
    ReadonlySignerAccount<TAccountBurnAuthority> &
      IAccountSignerMeta<TAccountBurnAuthority>,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenProgram,
    TAccountRent
  > &
    IInstructionWithSigners &
    IInstructionWithBytesCreatedOnChain
>;
export async function deprecatedMintPrintingTokensViaToken<
  TReturn,
  TAccountDestination extends string,
  TAccountToken extends string,
  TAccountOneTimePrintingAuthorizationMint extends string,
  TAccountPrintingMint extends string,
  TAccountBurnAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountTokenProgram extends string,
  TAccountRent extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>)
    | DeprecatedMintPrintingTokensViaTokenInput<
        TAccountDestination,
        TAccountToken,
        TAccountOneTimePrintingAuthorizationMint,
        TAccountPrintingMint,
        TAccountBurnAuthority,
        TAccountMetadata,
        TAccountMasterEdition,
        TAccountTokenProgram,
        TAccountRent
      >,
  rawInput?: DeprecatedMintPrintingTokensViaTokenInput<
    TAccountDestination,
    TAccountToken,
    TAccountOneTimePrintingAuthorizationMint,
    TAccountPrintingMint,
    TAccountBurnAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenProgram,
    TAccountRent
  >
): Promise<
  | TReturn
  | (IInstruction &
      IInstructionWithSigners &
      IInstructionWithBytesCreatedOnChain)
> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawContext) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as DeprecatedMintPrintingTokensViaTokenInput<
    TAccountDestination,
    TAccountToken,
    TAccountOneTimePrintingAuthorizationMint,
    TAccountPrintingMint,
    TAccountBurnAuthority,
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
      ? await context.getProgramAddress({
          name: 'mplTokenMetadata',
          address: defaultProgramAddress,
        })
      : defaultProgramAddress
  ) as Address<TProgram>;

  // Original accounts.
  type AccountMetas = Parameters<
    typeof deprecatedMintPrintingTokensViaTokenInstruction<
      TProgram,
      TAccountDestination,
      TAccountToken,
      TAccountOneTimePrintingAuthorizationMint,
      TAccountPrintingMint,
      TAccountBurnAuthority,
      TAccountMetadata,
      TAccountMasterEdition,
      TAccountTokenProgram,
      TAccountRent
    >
  >[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    destination: { value: input.destination ?? null, isWritable: true },
    token: { value: input.token ?? null, isWritable: true },
    oneTimePrintingAuthorizationMint: {
      value: input.oneTimePrintingAuthorizationMint ?? null,
      isWritable: true,
    },
    printingMint: { value: input.printingMint ?? null, isWritable: true },
    burnAuthority: { value: input.burnAuthority ?? null, isWritable: false },
    metadata: { value: input.metadata ?? null, isWritable: false },
    masterEdition: { value: input.masterEdition ?? null, isWritable: false },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false },
    rent: { value: input.rent ?? null, isWritable: false },
  };

  // Original args.
  const args = { ...input };

  // Resolve default values.
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value = await getProgramAddress(
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

  // Instruction.
  const instruction = {
    ...deprecatedMintPrintingTokensViaTokenInstruction(
      accountMetas as Record<keyof AccountMetas, IAccountMeta>,
      args as DeprecatedMintPrintingTokensViaTokenInstructionDataArgs,
      programAddress,
      remainingAccounts
    ),
    bytesCreatedOnChain,
  };

  return 'getGeneratedInstruction' in context && context.getGeneratedInstruction
    ? context.getGeneratedInstruction(instruction)
    : instruction;
}
