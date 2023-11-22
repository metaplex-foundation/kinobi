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

// Output.
export type DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountEdition extends string | IAccountMeta<string> = string,
  TAccountMasterEdition extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountMintAuthority extends string | IAccountMeta<string> = string,
  TAccountPrintingMint extends string | IAccountMeta<string> = string,
  TAccountMasterTokenAccount extends string | IAccountMeta<string> = string,
  TAccountEditionMarker extends string | IAccountMeta<string> = string,
  TAccountBurnAuthority extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountMasterUpdateAuthority extends string | IAccountMeta<string> = string,
  TAccountMasterMetadata extends string | IAccountMeta<string> = string,
  TAccountTokenProgram extends
    | string
    | IAccountMeta<string> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountRent extends
    | string
    | IAccountMeta<string> = 'SysvarRent111111111111111111111111111111111',
  TAccountReservationList extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountMetadata extends string
        ? WritableAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountEdition extends string
        ? WritableAccount<TAccountEdition>
        : TAccountEdition,
      TAccountMasterEdition extends string
        ? WritableAccount<TAccountMasterEdition>
        : TAccountMasterEdition,
      TAccountMint extends string
        ? WritableAccount<TAccountMint>
        : TAccountMint,
      TAccountMintAuthority extends string
        ? ReadonlySignerAccount<TAccountMintAuthority>
        : TAccountMintAuthority,
      TAccountPrintingMint extends string
        ? WritableAccount<TAccountPrintingMint>
        : TAccountPrintingMint,
      TAccountMasterTokenAccount extends string
        ? WritableAccount<TAccountMasterTokenAccount>
        : TAccountMasterTokenAccount,
      TAccountEditionMarker extends string
        ? WritableAccount<TAccountEditionMarker>
        : TAccountEditionMarker,
      TAccountBurnAuthority extends string
        ? ReadonlySignerAccount<TAccountBurnAuthority>
        : TAccountBurnAuthority,
      TAccountPayer extends string
        ? ReadonlySignerAccount<TAccountPayer>
        : TAccountPayer,
      TAccountMasterUpdateAuthority extends string
        ? ReadonlyAccount<TAccountMasterUpdateAuthority>
        : TAccountMasterUpdateAuthority,
      TAccountMasterMetadata extends string
        ? ReadonlyAccount<TAccountMasterMetadata>
        : TAccountMasterMetadata,
      TAccountTokenProgram extends string
        ? ReadonlyAccount<TAccountTokenProgram>
        : TAccountTokenProgram,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      TAccountRent extends string
        ? ReadonlyAccount<TAccountRent>
        : TAccountRent,
      TAccountReservationList extends string
        ? WritableAccount<TAccountReservationList>
        : TAccountReservationList,
      ...TRemainingAccounts
    ]
  >;

export type DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionData =
  { discriminator: number };

export type DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionDataArgs =
  {};

export function getDeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionDataEncoder(): Encoder<DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<{ discriminator: number }>(
      [['discriminator', getU8Encoder()]],
      {
        description:
          'DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionData',
      }
    ),
    (value) => ({ ...value, discriminator: 3 })
  ) as Encoder<DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionDataArgs>;
}

export function getDeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionDataDecoder(): Decoder<DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionData> {
  return getStructDecoder<DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionData>(
    [['discriminator', getU8Decoder()]],
    {
      description:
        'DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionData',
    }
  ) as Decoder<DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionData>;
}

export function getDeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionDataCodec(): Codec<
  DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionDataArgs,
  DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionData
> {
  return combineCodec(
    getDeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionDataEncoder(),
    getDeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionDataDecoder()
  );
}

export function deprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountEdition extends string | IAccountMeta<string> = string,
  TAccountMasterEdition extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountMintAuthority extends string | IAccountMeta<string> = string,
  TAccountPrintingMint extends string | IAccountMeta<string> = string,
  TAccountMasterTokenAccount extends string | IAccountMeta<string> = string,
  TAccountEditionMarker extends string | IAccountMeta<string> = string,
  TAccountBurnAuthority extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountMasterUpdateAuthority extends string | IAccountMeta<string> = string,
  TAccountMasterMetadata extends string | IAccountMeta<string> = string,
  TAccountTokenProgram extends
    | string
    | IAccountMeta<string> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountRent extends
    | string
    | IAccountMeta<string> = 'SysvarRent111111111111111111111111111111111',
  TAccountReservationList extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
>(
  accounts: {
    metadata: TAccountMetadata extends string
      ? Address<TAccountMetadata>
      : TAccountMetadata;
    edition: TAccountEdition extends string
      ? Address<TAccountEdition>
      : TAccountEdition;
    masterEdition: TAccountMasterEdition extends string
      ? Address<TAccountMasterEdition>
      : TAccountMasterEdition;
    mint: TAccountMint extends string ? Address<TAccountMint> : TAccountMint;
    mintAuthority: TAccountMintAuthority extends string
      ? Address<TAccountMintAuthority>
      : TAccountMintAuthority;
    printingMint: TAccountPrintingMint extends string
      ? Address<TAccountPrintingMint>
      : TAccountPrintingMint;
    masterTokenAccount: TAccountMasterTokenAccount extends string
      ? Address<TAccountMasterTokenAccount>
      : TAccountMasterTokenAccount;
    editionMarker: TAccountEditionMarker extends string
      ? Address<TAccountEditionMarker>
      : TAccountEditionMarker;
    burnAuthority: TAccountBurnAuthority extends string
      ? Address<TAccountBurnAuthority>
      : TAccountBurnAuthority;
    payer: TAccountPayer extends string
      ? Address<TAccountPayer>
      : TAccountPayer;
    masterUpdateAuthority: TAccountMasterUpdateAuthority extends string
      ? Address<TAccountMasterUpdateAuthority>
      : TAccountMasterUpdateAuthority;
    masterMetadata: TAccountMasterMetadata extends string
      ? Address<TAccountMasterMetadata>
      : TAccountMasterMetadata;
    tokenProgram?: TAccountTokenProgram extends string
      ? Address<TAccountTokenProgram>
      : TAccountTokenProgram;
    systemProgram?: TAccountSystemProgram extends string
      ? Address<TAccountSystemProgram>
      : TAccountSystemProgram;
    rent?: TAccountRent extends string ? Address<TAccountRent> : TAccountRent;
    reservationList?: TAccountReservationList extends string
      ? Address<TAccountReservationList>
      : TAccountReservationList;
  },
  programAddress: Address<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<TProgram>,
  remainingAccounts?: TRemainingAccounts
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.metadata, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.edition, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.masterEdition, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.mint, AccountRole.WRITABLE),
      accountMetaWithDefault(
        accounts.mintAuthority,
        AccountRole.READONLY_SIGNER
      ),
      accountMetaWithDefault(accounts.printingMint, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.masterTokenAccount, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.editionMarker, AccountRole.WRITABLE),
      accountMetaWithDefault(
        accounts.burnAuthority,
        AccountRole.READONLY_SIGNER
      ),
      accountMetaWithDefault(accounts.payer, AccountRole.READONLY_SIGNER),
      accountMetaWithDefault(
        accounts.masterUpdateAuthority,
        AccountRole.READONLY
      ),
      accountMetaWithDefault(accounts.masterMetadata, AccountRole.READONLY),
      accountMetaWithDefault(
        accounts.tokenProgram ?? {
          address:
            'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Address<'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
      accountMetaWithDefault(
        accounts.systemProgram ?? {
          address:
            '11111111111111111111111111111111' as Address<'11111111111111111111111111111111'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
      accountMetaWithDefault(
        accounts.rent ?? 'SysvarRent111111111111111111111111111111111',
        AccountRole.READONLY
      ),
      accountMetaWithDefault(
        accounts.reservationList ?? {
          address:
            'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>,
          role: AccountRole.READONLY,
        },
        AccountRole.WRITABLE
      ),
      ...(remainingAccounts ?? []),
    ],
    data: getDeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionDataEncoder().encode(
      {}
    ),
    programAddress,
  } as DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstruction<
    TProgram,
    TAccountMetadata,
    TAccountEdition,
    TAccountMasterEdition,
    TAccountMint,
    TAccountMintAuthority,
    TAccountPrintingMint,
    TAccountMasterTokenAccount,
    TAccountEditionMarker,
    TAccountBurnAuthority,
    TAccountPayer,
    TAccountMasterUpdateAuthority,
    TAccountMasterMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent,
    TAccountReservationList,
    TRemainingAccounts
  >;
}

// Input.
export type DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInput<
  TAccountMetadata extends string,
  TAccountEdition extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountMintAuthority extends string,
  TAccountPrintingMint extends string,
  TAccountMasterTokenAccount extends string,
  TAccountEditionMarker extends string,
  TAccountBurnAuthority extends string,
  TAccountPayer extends string,
  TAccountMasterUpdateAuthority extends string,
  TAccountMasterMetadata extends string,
  TAccountTokenProgram extends string,
  TAccountSystemProgram extends string,
  TAccountRent extends string,
  TAccountReservationList extends string
> = {
  /** New Metadata key (pda of ['metadata', program id, mint id]) */
  metadata: Address<TAccountMetadata>;
  /** New Edition V1 (pda of ['metadata', program id, mint id, 'edition']) */
  edition: Address<TAccountEdition>;
  /** Master Record Edition V1 (pda of ['metadata', program id, master metadata mint id, 'edition']) */
  masterEdition: Address<TAccountMasterEdition>;
  /** Mint of new token - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY */
  mint: Address<TAccountMint>;
  /** Mint authority of new mint */
  mintAuthority: TransactionSigner<TAccountMintAuthority>;
  /** Printing Mint of master record edition */
  printingMint: Address<TAccountPrintingMint>;
  /** Token account containing Printing mint token to be transferred */
  masterTokenAccount: Address<TAccountMasterTokenAccount>;
  /** Edition pda to mark creation - will be checked for pre-existence. (pda of ['metadata', program id, master mint id, edition_number]) */
  editionMarker: Address<TAccountEditionMarker>;
  /** Burn authority for this token */
  burnAuthority: TransactionSigner<TAccountBurnAuthority>;
  /** payer */
  payer?: TransactionSigner<TAccountPayer>;
  /** update authority info for new metadata account */
  masterUpdateAuthority: Address<TAccountMasterUpdateAuthority>;
  /** Master record metadata account */
  masterMetadata: Address<TAccountMasterMetadata>;
  /** Token program */
  tokenProgram?: Address<TAccountTokenProgram>;
  /** System program */
  systemProgram?: Address<TAccountSystemProgram>;
  /** Rent info */
  rent?: Address<TAccountRent>;
  /** Reservation List - If present, and you are on this list, you can get an edition number given by your position on the list. */
  reservationList?: Address<TAccountReservationList>;
};

export async function deprecatedMintNewEditionFromMasterEditionViaPrintingToken<
  TReturn,
  TAccountMetadata extends string,
  TAccountEdition extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountMintAuthority extends string,
  TAccountPrintingMint extends string,
  TAccountMasterTokenAccount extends string,
  TAccountEditionMarker extends string,
  TAccountBurnAuthority extends string,
  TAccountPayer extends string,
  TAccountMasterUpdateAuthority extends string,
  TAccountMasterMetadata extends string,
  TAccountTokenProgram extends string,
  TAccountSystemProgram extends string,
  TAccountRent extends string,
  TAccountReservationList extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstruction<
        TProgram,
        TAccountMetadata,
        TAccountEdition,
        TAccountMasterEdition,
        TAccountMint,
        ReadonlySignerAccount<TAccountMintAuthority> &
          IAccountSignerMeta<TAccountMintAuthority>,
        TAccountPrintingMint,
        TAccountMasterTokenAccount,
        TAccountEditionMarker,
        ReadonlySignerAccount<TAccountBurnAuthority> &
          IAccountSignerMeta<TAccountBurnAuthority>,
        ReadonlySignerAccount<TAccountPayer> &
          IAccountSignerMeta<TAccountPayer>,
        TAccountMasterUpdateAuthority,
        TAccountMasterMetadata,
        TAccountTokenProgram,
        TAccountSystemProgram,
        TAccountRent,
        TAccountReservationList
      >,
      TReturn
    >,
  input: DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInput<
    TAccountMetadata,
    TAccountEdition,
    TAccountMasterEdition,
    TAccountMint,
    TAccountMintAuthority,
    TAccountPrintingMint,
    TAccountMasterTokenAccount,
    TAccountEditionMarker,
    TAccountBurnAuthority,
    TAccountPayer,
    TAccountMasterUpdateAuthority,
    TAccountMasterMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent,
    TAccountReservationList
  >
): Promise<TReturn>;
export async function deprecatedMintNewEditionFromMasterEditionViaPrintingToken<
  TAccountMetadata extends string,
  TAccountEdition extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountMintAuthority extends string,
  TAccountPrintingMint extends string,
  TAccountMasterTokenAccount extends string,
  TAccountEditionMarker extends string,
  TAccountBurnAuthority extends string,
  TAccountPayer extends string,
  TAccountMasterUpdateAuthority extends string,
  TAccountMasterMetadata extends string,
  TAccountTokenProgram extends string,
  TAccountSystemProgram extends string,
  TAccountRent extends string,
  TAccountReservationList extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInput<
    TAccountMetadata,
    TAccountEdition,
    TAccountMasterEdition,
    TAccountMint,
    TAccountMintAuthority,
    TAccountPrintingMint,
    TAccountMasterTokenAccount,
    TAccountEditionMarker,
    TAccountBurnAuthority,
    TAccountPayer,
    TAccountMasterUpdateAuthority,
    TAccountMasterMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent,
    TAccountReservationList
  >
): Promise<
  DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstruction<
    TProgram,
    TAccountMetadata,
    TAccountEdition,
    TAccountMasterEdition,
    TAccountMint,
    ReadonlySignerAccount<TAccountMintAuthority> &
      IAccountSignerMeta<TAccountMintAuthority>,
    TAccountPrintingMint,
    TAccountMasterTokenAccount,
    TAccountEditionMarker,
    ReadonlySignerAccount<TAccountBurnAuthority> &
      IAccountSignerMeta<TAccountBurnAuthority>,
    ReadonlySignerAccount<TAccountPayer> & IAccountSignerMeta<TAccountPayer>,
    TAccountMasterUpdateAuthority,
    TAccountMasterMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent,
    TAccountReservationList
  > &
    IInstructionWithSigners &
    IInstructionWithBytesCreatedOnChain
>;
export async function deprecatedMintNewEditionFromMasterEditionViaPrintingToken<
  TAccountMetadata extends string,
  TAccountEdition extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountMintAuthority extends string,
  TAccountPrintingMint extends string,
  TAccountMasterTokenAccount extends string,
  TAccountEditionMarker extends string,
  TAccountBurnAuthority extends string,
  TAccountPayer extends string,
  TAccountMasterUpdateAuthority extends string,
  TAccountMasterMetadata extends string,
  TAccountTokenProgram extends string,
  TAccountSystemProgram extends string,
  TAccountRent extends string,
  TAccountReservationList extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  input: DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInput<
    TAccountMetadata,
    TAccountEdition,
    TAccountMasterEdition,
    TAccountMint,
    TAccountMintAuthority,
    TAccountPrintingMint,
    TAccountMasterTokenAccount,
    TAccountEditionMarker,
    TAccountBurnAuthority,
    TAccountPayer,
    TAccountMasterUpdateAuthority,
    TAccountMasterMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent,
    TAccountReservationList
  >
): Promise<
  DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstruction<
    TProgram,
    TAccountMetadata,
    TAccountEdition,
    TAccountMasterEdition,
    TAccountMint,
    ReadonlySignerAccount<TAccountMintAuthority> &
      IAccountSignerMeta<TAccountMintAuthority>,
    TAccountPrintingMint,
    TAccountMasterTokenAccount,
    TAccountEditionMarker,
    ReadonlySignerAccount<TAccountBurnAuthority> &
      IAccountSignerMeta<TAccountBurnAuthority>,
    ReadonlySignerAccount<TAccountPayer> & IAccountSignerMeta<TAccountPayer>,
    TAccountMasterUpdateAuthority,
    TAccountMasterMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent,
    TAccountReservationList
  > &
    IInstructionWithSigners &
    IInstructionWithBytesCreatedOnChain
>;
export async function deprecatedMintNewEditionFromMasterEditionViaPrintingToken<
  TReturn,
  TAccountMetadata extends string,
  TAccountEdition extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountMintAuthority extends string,
  TAccountPrintingMint extends string,
  TAccountMasterTokenAccount extends string,
  TAccountEditionMarker extends string,
  TAccountBurnAuthority extends string,
  TAccountPayer extends string,
  TAccountMasterUpdateAuthority extends string,
  TAccountMasterMetadata extends string,
  TAccountTokenProgram extends string,
  TAccountSystemProgram extends string,
  TAccountRent extends string,
  TAccountReservationList extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>)
    | DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInput<
        TAccountMetadata,
        TAccountEdition,
        TAccountMasterEdition,
        TAccountMint,
        TAccountMintAuthority,
        TAccountPrintingMint,
        TAccountMasterTokenAccount,
        TAccountEditionMarker,
        TAccountBurnAuthority,
        TAccountPayer,
        TAccountMasterUpdateAuthority,
        TAccountMasterMetadata,
        TAccountTokenProgram,
        TAccountSystemProgram,
        TAccountRent,
        TAccountReservationList
      >,
  rawInput?: DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInput<
    TAccountMetadata,
    TAccountEdition,
    TAccountMasterEdition,
    TAccountMint,
    TAccountMintAuthority,
    TAccountPrintingMint,
    TAccountMasterTokenAccount,
    TAccountEditionMarker,
    TAccountBurnAuthority,
    TAccountPayer,
    TAccountMasterUpdateAuthority,
    TAccountMasterMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent,
    TAccountReservationList
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
  ) as DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInput<
    TAccountMetadata,
    TAccountEdition,
    TAccountMasterEdition,
    TAccountMint,
    TAccountMintAuthority,
    TAccountPrintingMint,
    TAccountMasterTokenAccount,
    TAccountEditionMarker,
    TAccountBurnAuthority,
    TAccountPayer,
    TAccountMasterUpdateAuthority,
    TAccountMasterMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent,
    TAccountReservationList
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
    typeof deprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstruction<
      TProgram,
      TAccountMetadata,
      TAccountEdition,
      TAccountMasterEdition,
      TAccountMint,
      TAccountMintAuthority,
      TAccountPrintingMint,
      TAccountMasterTokenAccount,
      TAccountEditionMarker,
      TAccountBurnAuthority,
      TAccountPayer,
      TAccountMasterUpdateAuthority,
      TAccountMasterMetadata,
      TAccountTokenProgram,
      TAccountSystemProgram,
      TAccountRent,
      TAccountReservationList
    >
  >[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    metadata: { value: input.metadata ?? null, isWritable: true },
    edition: { value: input.edition ?? null, isWritable: true },
    masterEdition: { value: input.masterEdition ?? null, isWritable: true },
    mint: { value: input.mint ?? null, isWritable: true },
    mintAuthority: { value: input.mintAuthority ?? null, isWritable: false },
    printingMint: { value: input.printingMint ?? null, isWritable: true },
    masterTokenAccount: {
      value: input.masterTokenAccount ?? null,
      isWritable: true,
    },
    editionMarker: { value: input.editionMarker ?? null, isWritable: true },
    burnAuthority: { value: input.burnAuthority ?? null, isWritable: false },
    payer: { value: input.payer ?? null, isWritable: false },
    masterUpdateAuthority: {
      value: input.masterUpdateAuthority ?? null,
      isWritable: false,
    },
    masterMetadata: { value: input.masterMetadata ?? null, isWritable: false },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
    rent: { value: input.rent ?? null, isWritable: false },
    reservationList: { value: input.reservationList ?? null, isWritable: true },
  };

  // Resolve default values.
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value = await getProgramAddress(
      context,
      'splToken',
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    );
    accounts.tokenProgram.isWritable = false;
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = await getProgramAddress(
      context,
      'splSystem',
      '11111111111111111111111111111111'
    );
    accounts.systemProgram.isWritable = false;
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
    ...deprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstruction(
      accountMetas as Record<keyof AccountMetas, IAccountMeta>,
      programAddress,
      remainingAccounts
    ),
    bytesCreatedOnChain,
  };

  return 'getGeneratedInstruction' in context && context.getGeneratedInstruction
    ? context.getGeneratedInstruction(instruction)
    : instruction;
}
