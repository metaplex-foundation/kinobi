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
    | IAccountMeta<string> = 'SysvarRent111111111111111111111111111111111'
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
      TAccountRent extends string ? ReadonlyAccount<TAccountRent> : TAccountRent
    ]
  >;

export type DeprecatedMintPrintingTokensInstructionData = {
  discriminator: number;
  mintPrintingTokensViaTokenArgs: MintPrintingTokensViaTokenArgs;
};

export type DeprecatedMintPrintingTokensInstructionDataArgs = {
  mintPrintingTokensViaTokenArgs: MintPrintingTokensViaTokenArgsArgs;
};

export function getDeprecatedMintPrintingTokensInstructionDataEncoder(): Encoder<DeprecatedMintPrintingTokensInstructionDataArgs> {
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
      { description: 'DeprecatedMintPrintingTokensInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 9 })
  ) as Encoder<DeprecatedMintPrintingTokensInstructionDataArgs>;
}

export function getDeprecatedMintPrintingTokensInstructionDataDecoder(): Decoder<DeprecatedMintPrintingTokensInstructionData> {
  return getStructDecoder<DeprecatedMintPrintingTokensInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      [
        'mintPrintingTokensViaTokenArgs',
        getMintPrintingTokensViaTokenArgsDecoder(),
      ],
    ],
    { description: 'DeprecatedMintPrintingTokensInstructionData' }
  ) as Decoder<DeprecatedMintPrintingTokensInstructionData>;
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

export function deprecatedMintPrintingTokensInstruction<
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
    | IAccountMeta<string> = 'SysvarRent111111111111111111111111111111111'
>(
  accounts: {
    destination: TAccountDestination extends string
      ? Base58EncodedAddress<TAccountDestination>
      : TAccountDestination;
    printingMint: TAccountPrintingMint extends string
      ? Base58EncodedAddress<TAccountPrintingMint>
      : TAccountPrintingMint;
    updateAuthority: TAccountUpdateAuthority extends string
      ? Base58EncodedAddress<TAccountUpdateAuthority>
      : TAccountUpdateAuthority;
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
  args: DeprecatedMintPrintingTokensInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<TProgram>
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
    TAccountRent
  >;
}

// Input.
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
  destination: Base58EncodedAddress<TAccountDestination>;
  /** Printing mint */
  printingMint: Base58EncodedAddress<TAccountPrintingMint>;
  /** Update authority */
  updateAuthority: Signer<TAccountUpdateAuthority>;
  /** Metadata key (pda of ['metadata', program id, mint id]) */
  metadata: Base58EncodedAddress<TAccountMetadata>;
  /** Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition']) */
  masterEdition: Base58EncodedAddress<TAccountMasterEdition>;
  /** Token program */
  tokenProgram?: Base58EncodedAddress<TAccountTokenProgram>;
  /** Rent */
  rent?: Base58EncodedAddress<TAccountRent>;
  mintPrintingTokensViaTokenArgs: DeprecatedMintPrintingTokensInstructionDataArgs['mintPrintingTokensViaTokenArgs'];
};

export async function deprecatedMintPrintingTokens<
  TReturn,
  TAccountDestination extends string,
  TAccountPrintingMint extends string,
  TAccountUpdateAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountTokenProgram extends string,
  TAccountRent extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      DeprecatedMintPrintingTokensInstruction<
        TProgram,
        TAccountDestination,
        TAccountPrintingMint,
        TAccountUpdateAuthority,
        TAccountMetadata,
        TAccountMasterEdition,
        TAccountTokenProgram,
        TAccountRent
      >,
      TReturn
    >,
  input: DeprecatedMintPrintingTokensInput<
    TAccountDestination,
    TAccountPrintingMint,
    TAccountUpdateAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenProgram,
    TAccountRent
  >
): Promise<TReturn>;
export async function deprecatedMintPrintingTokens<
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
): Promise<
  WrappedInstruction<
    DeprecatedMintPrintingTokensInstruction<
      TProgram,
      TAccountDestination,
      TAccountPrintingMint,
      TAccountUpdateAuthority,
      TAccountMetadata,
      TAccountMasterEdition,
      TAccountTokenProgram,
      TAccountRent
    >
  >
>;
export async function deprecatedMintPrintingTokens<
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
): Promise<
  WrappedInstruction<
    DeprecatedMintPrintingTokensInstruction<
      TProgram,
      TAccountDestination,
      TAccountPrintingMint,
      TAccountUpdateAuthority,
      TAccountMetadata,
      TAccountMasterEdition,
      TAccountTokenProgram,
      TAccountRent
    >
  >
>;
export async function deprecatedMintPrintingTokens<
  TReturn,
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
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>)
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
): Promise<TReturn | WrappedInstruction<IInstruction>> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>);
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
    typeof deprecatedMintPrintingTokensInstruction<
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

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return {
    instruction: deprecatedMintPrintingTokensInstruction(
      accountMetas as Record<keyof AccountMetas, IAccountMeta>,
      args as DeprecatedMintPrintingTokensInstructionDataArgs,
      programAddress
    ),
    signers,
    bytesCreatedOnChain,
  };
}
