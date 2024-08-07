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
  type ReadonlySignerAccount,
  type TransactionSigner,
  type WritableAccount,
} from '@solana/web3.js';
import { MPL_TOKEN_METADATA_PROGRAM_ADDRESS } from '../programs';
import { getAccountMetaFactory, type ResolvedAccount } from '../shared';

export type DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstruction<
  TProgram extends string = typeof MPL_TOKEN_METADATA_PROGRAM_ADDRESS,
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
  TRemainingAccounts extends readonly IAccountMeta<string>[] = [],
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
        ? ReadonlySignerAccount<TAccountMintAuthority> &
            IAccountSignerMeta<TAccountMintAuthority>
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
        ? ReadonlySignerAccount<TAccountBurnAuthority> &
            IAccountSignerMeta<TAccountBurnAuthority>
        : TAccountBurnAuthority,
      TAccountPayer extends string
        ? ReadonlySignerAccount<TAccountPayer> &
            IAccountSignerMeta<TAccountPayer>
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
      ...TRemainingAccounts,
    ]
  >;

export type DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionData =
  { discriminator: number };

export type DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionDataArgs =
  {};

export function getDeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionDataEncoder(): Encoder<DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionDataArgs> {
  return transformEncoder(
    getStructEncoder([['discriminator', getU8Encoder()]]),
    (value) => ({ ...value, discriminator: 3 })
  );
}

export function getDeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionDataDecoder(): Decoder<DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionData> {
  return getStructDecoder([['discriminator', getU8Decoder()]]);
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

export type DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInput<
  TAccountMetadata extends string = string,
  TAccountEdition extends string = string,
  TAccountMasterEdition extends string = string,
  TAccountMint extends string = string,
  TAccountMintAuthority extends string = string,
  TAccountPrintingMint extends string = string,
  TAccountMasterTokenAccount extends string = string,
  TAccountEditionMarker extends string = string,
  TAccountBurnAuthority extends string = string,
  TAccountPayer extends string = string,
  TAccountMasterUpdateAuthority extends string = string,
  TAccountMasterMetadata extends string = string,
  TAccountTokenProgram extends string = string,
  TAccountSystemProgram extends string = string,
  TAccountRent extends string = string,
  TAccountReservationList extends string = string,
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
  payer: TransactionSigner<TAccountPayer>;
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

export function getDeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstruction<
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
): DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstruction<
  typeof MPL_TOKEN_METADATA_PROGRAM_ADDRESS,
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
> {
  // Program address.
  const programAddress = MPL_TOKEN_METADATA_PROGRAM_ADDRESS;

  // Original accounts.
  const originalAccounts = {
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
  const accounts = originalAccounts as Record<
    keyof typeof originalAccounts,
    ResolvedAccount
  >;

  // Resolve default values.
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value =
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Address<'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'>;
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value =
      '11111111111111111111111111111111' as Address<'11111111111111111111111111111111'>;
  }
  if (!accounts.rent.value) {
    accounts.rent.value =
      'SysvarRent111111111111111111111111111111111' as Address<'SysvarRent111111111111111111111111111111111'>;
  }

  const getAccountMeta = getAccountMetaFactory(programAddress, 'programId');
  const instruction = {
    accounts: [
      getAccountMeta(accounts.metadata),
      getAccountMeta(accounts.edition),
      getAccountMeta(accounts.masterEdition),
      getAccountMeta(accounts.mint),
      getAccountMeta(accounts.mintAuthority),
      getAccountMeta(accounts.printingMint),
      getAccountMeta(accounts.masterTokenAccount),
      getAccountMeta(accounts.editionMarker),
      getAccountMeta(accounts.burnAuthority),
      getAccountMeta(accounts.payer),
      getAccountMeta(accounts.masterUpdateAuthority),
      getAccountMeta(accounts.masterMetadata),
      getAccountMeta(accounts.tokenProgram),
      getAccountMeta(accounts.systemProgram),
      getAccountMeta(accounts.rent),
      getAccountMeta(accounts.reservationList),
    ],
    programAddress,
    data: getDeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionDataEncoder().encode(
      {}
    ),
  } as DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstruction<
    typeof MPL_TOKEN_METADATA_PROGRAM_ADDRESS,
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

  return instruction;
}

export type ParsedDeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstruction<
  TProgram extends string = typeof MPL_TOKEN_METADATA_PROGRAM_ADDRESS,
  TAccountMetas extends readonly IAccountMeta[] = readonly IAccountMeta[],
> = {
  programAddress: Address<TProgram>;
  accounts: {
    /** New Metadata key (pda of ['metadata', program id, mint id]) */
    metadata: TAccountMetas[0];
    /** New Edition V1 (pda of ['metadata', program id, mint id, 'edition']) */
    edition: TAccountMetas[1];
    /** Master Record Edition V1 (pda of ['metadata', program id, master metadata mint id, 'edition']) */
    masterEdition: TAccountMetas[2];
    /** Mint of new token - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY */
    mint: TAccountMetas[3];
    /** Mint authority of new mint */
    mintAuthority: TAccountMetas[4];
    /** Printing Mint of master record edition */
    printingMint: TAccountMetas[5];
    /** Token account containing Printing mint token to be transferred */
    masterTokenAccount: TAccountMetas[6];
    /** Edition pda to mark creation - will be checked for pre-existence. (pda of ['metadata', program id, master mint id, edition_number]) */
    editionMarker: TAccountMetas[7];
    /** Burn authority for this token */
    burnAuthority: TAccountMetas[8];
    /** payer */
    payer: TAccountMetas[9];
    /** update authority info for new metadata account */
    masterUpdateAuthority: TAccountMetas[10];
    /** Master record metadata account */
    masterMetadata: TAccountMetas[11];
    /** Token program */
    tokenProgram: TAccountMetas[12];
    /** System program */
    systemProgram: TAccountMetas[13];
    /** Rent info */
    rent: TAccountMetas[14];
    /** Reservation List - If present, and you are on this list, you can get an edition number given by your position on the list. */
    reservationList?: TAccountMetas[15] | undefined;
  };
  data: DeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionData;
};

export function parseDeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstruction<
  TProgram extends string,
  TAccountMetas extends readonly IAccountMeta[],
>(
  instruction: IInstruction<TProgram> &
    IInstructionWithAccounts<TAccountMetas> &
    IInstructionWithData<Uint8Array>
): ParsedDeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstruction<
  TProgram,
  TAccountMetas
> {
  if (instruction.accounts.length < 16) {
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
      edition: getNextAccount(),
      masterEdition: getNextAccount(),
      mint: getNextAccount(),
      mintAuthority: getNextAccount(),
      printingMint: getNextAccount(),
      masterTokenAccount: getNextAccount(),
      editionMarker: getNextAccount(),
      burnAuthority: getNextAccount(),
      payer: getNextAccount(),
      masterUpdateAuthority: getNextAccount(),
      masterMetadata: getNextAccount(),
      tokenProgram: getNextAccount(),
      systemProgram: getNextAccount(),
      rent: getNextAccount(),
      reservationList: getNextOptionalAccount(),
    },
    data: getDeprecatedMintNewEditionFromMasterEditionViaPrintingTokenInstructionDataDecoder().decode(
      instruction.data
    ),
  };
}
