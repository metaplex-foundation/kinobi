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
  ReadonlyAccount,
  ReadonlySignerAccount,
  WritableAccount,
} from '@solana/instructions';
import {
  Context,
  CustomGeneratedInstruction,
  ResolvedAccount,
  Signer,
  WrappedInstruction,
  accountMetaWithDefault,
  getAccountMetasAndSigners,
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
    | IAccountMeta<string> = 'SysvarRent111111111111111111111111111111111'
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
      TAccountRent extends string ? ReadonlyAccount<TAccountRent> : TAccountRent
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
    getStructEncoder<DeprecatedMintPrintingTokensViaTokenInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        [
          'mintPrintingTokensViaTokenArgs',
          getMintPrintingTokensViaTokenArgsEncoder(),
        ],
      ],
      { description: 'DeprecatedMintPrintingTokensViaTokenInstructionData' }
    ),
    (value) =>
      ({
        ...value,
        discriminator: 8,
      } as DeprecatedMintPrintingTokensViaTokenInstructionData)
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
    | IAccountMeta<string> = 'SysvarRent111111111111111111111111111111111'
>(
  accounts: {
    destination: TAccountDestination extends string
      ? Base58EncodedAddress<TAccountDestination>
      : TAccountDestination;
    token: TAccountToken extends string
      ? Base58EncodedAddress<TAccountToken>
      : TAccountToken;
    oneTimePrintingAuthorizationMint: TAccountOneTimePrintingAuthorizationMint extends string
      ? Base58EncodedAddress<TAccountOneTimePrintingAuthorizationMint>
      : TAccountOneTimePrintingAuthorizationMint;
    printingMint: TAccountPrintingMint extends string
      ? Base58EncodedAddress<TAccountPrintingMint>
      : TAccountPrintingMint;
    burnAuthority: TAccountBurnAuthority extends string
      ? Base58EncodedAddress<TAccountBurnAuthority>
      : TAccountBurnAuthority;
    metadata: TAccountMetadata extends string
      ? Base58EncodedAddress<TAccountMetadata>
      : TAccountMetadata;
    masterEdition: TAccountMasterEdition extends string
      ? Base58EncodedAddress<TAccountMasterEdition>
      : TAccountMasterEdition;
    tokenProgram?: TAccountTokenProgram extends string
      ? Base58EncodedAddress<TAccountTokenProgram>
      : TAccountTokenProgram;
    rent?: TAccountRent extends string
      ? Base58EncodedAddress<TAccountRent>
      : TAccountRent;
  },
  args: DeprecatedMintPrintingTokensViaTokenInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<TProgram>
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
            'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
      accountMetaWithDefault(
        accounts.rent ?? 'SysvarRent111111111111111111111111111111111',
        AccountRole.READONLY
      ),
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
    TAccountRent
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
  destination: Base58EncodedAddress<TAccountDestination>;
  /** Token account containing one time authorization token */
  token: Base58EncodedAddress<TAccountToken>;
  /** One time authorization mint */
  oneTimePrintingAuthorizationMint: Base58EncodedAddress<TAccountOneTimePrintingAuthorizationMint>;
  /** Printing mint */
  printingMint: Base58EncodedAddress<TAccountPrintingMint>;
  /** Burn authority */
  burnAuthority: Signer<TAccountBurnAuthority>;
  /** Metadata key (pda of ['metadata', program id, mint id]) */
  metadata: Base58EncodedAddress<TAccountMetadata>;
  /** Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition']) */
  masterEdition: Base58EncodedAddress<TAccountMasterEdition>;
  /** Token program */
  tokenProgram?: Base58EncodedAddress<TAccountTokenProgram>;
  /** Rent */
  rent?: Base58EncodedAddress<TAccountRent>;
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
        TAccountBurnAuthority,
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
  WrappedInstruction<
    DeprecatedMintPrintingTokensViaTokenInstruction<
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
  >
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
  WrappedInstruction<
    DeprecatedMintPrintingTokensViaTokenInstruction<
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
  >
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
): Promise<TReturn | WrappedInstruction<IInstruction>> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
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
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>;
  const programAddress = (
    context.getProgramAddress
      ? await context.getProgramAddress({
          name: 'mplTokenMetadata',
          address: defaultProgramAddress,
        })
      : defaultProgramAddress
  ) as Base58EncodedAddress<TProgram>;

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
      'SysvarRent111111111111111111111111111111111' as Base58EncodedAddress<'SysvarRent111111111111111111111111111111111'>;
  }

  // Get account metas and signers.
  const [accountMetas, signers] = getAccountMetasAndSigners(
    accounts,
    'programId',
    programAddress
  );

  // Remaining accounts.
  // TODO

  // Bytes created on chain.
  // TODO

  return {
    instruction: deprecatedMintPrintingTokensViaTokenInstruction(
      accountMetas as Record<keyof AccountMetas, IAccountMeta>,
      args,
      programAddress
    ),
    signers,
    bytesCreatedOnChain: 0,
  };
}
