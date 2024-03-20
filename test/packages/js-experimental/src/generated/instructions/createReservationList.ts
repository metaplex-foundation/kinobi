/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Address } from '@solana/addresses';
import {
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
  CreateReservationListInstructionData,
  CreateReservationListInstructionDataArgs,
  getCreateReservationListInstructionDataDecoder,
  getCreateReservationListInstructionDataEncoder,
} from '../../hooked';
import { ResolvedAccount, getAccountMetasWithSigners } from '../shared';

export type CreateReservationListInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountReservationList extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string,
  TAccountMasterEdition extends string | IAccountMeta<string> = string,
  TAccountResource extends string | IAccountMeta<string> = string,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountRent extends
    | string
    | IAccountMeta<string> = 'SysvarRent111111111111111111111111111111111',
  TRemainingAccounts extends readonly IAccountMeta<string>[] = [],
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountReservationList extends string
        ? WritableAccount<TAccountReservationList>
        : TAccountReservationList,
      TAccountPayer extends string
        ? ReadonlySignerAccount<TAccountPayer> &
            IAccountSignerMeta<TAccountPayer>
        : TAccountPayer,
      TAccountUpdateAuthority extends string
        ? ReadonlySignerAccount<TAccountUpdateAuthority> &
            IAccountSignerMeta<TAccountUpdateAuthority>
        : TAccountUpdateAuthority,
      TAccountMasterEdition extends string
        ? ReadonlyAccount<TAccountMasterEdition>
        : TAccountMasterEdition,
      TAccountResource extends string
        ? ReadonlyAccount<TAccountResource>
        : TAccountResource,
      TAccountMetadata extends string
        ? ReadonlyAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      TAccountRent extends string
        ? ReadonlyAccount<TAccountRent>
        : TAccountRent,
      ...TRemainingAccounts,
    ]
  >;

export type CreateReservationListInput<
  TAccountReservationList extends string = string,
  TAccountPayer extends string = string,
  TAccountUpdateAuthority extends string = string,
  TAccountMasterEdition extends string = string,
  TAccountResource extends string = string,
  TAccountMetadata extends string = string,
  TAccountSystemProgram extends string = string,
  TAccountRent extends string = string,
> = {
  /** PDA for ReservationList of ['metadata', program id, master edition key, 'reservation', resource-key] */
  reservationList: Address<TAccountReservationList>;
  /** Payer */
  payer: TransactionSigner<TAccountPayer>;
  /** Update authority */
  updateAuthority: TransactionSigner<TAccountUpdateAuthority>;
  /**  Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition']) */
  masterEdition: Address<TAccountMasterEdition>;
  /** A resource you wish to tie the reservation list to. This is so your later visitors who come to redeem can derive your reservation list PDA with something they can easily get at. You choose what this should be. */
  resource: Address<TAccountResource>;
  /** Metadata key (pda of ['metadata', program id, mint id]) */
  metadata: Address<TAccountMetadata>;
  /** System program */
  systemProgram?: Address<TAccountSystemProgram>;
  /** Rent info */
  rent?: Address<TAccountRent>;
};

export function getCreateReservationListInstruction<
  TAccountReservationList extends string,
  TAccountPayer extends string,
  TAccountUpdateAuthority extends string,
  TAccountMasterEdition extends string,
  TAccountResource extends string,
  TAccountMetadata extends string,
  TAccountSystemProgram extends string,
  TAccountRent extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
>(
  input: CreateReservationListInput<
    TAccountReservationList,
    TAccountPayer,
    TAccountUpdateAuthority,
    TAccountMasterEdition,
    TAccountResource,
    TAccountMetadata,
    TAccountSystemProgram,
    TAccountRent
  >
): CreateReservationListInstruction<
  TProgram,
  TAccountReservationList,
  TAccountPayer,
  TAccountUpdateAuthority,
  TAccountMasterEdition,
  TAccountResource,
  TAccountMetadata,
  TAccountSystemProgram,
  TAccountRent
> {
  // Program address.
  const programAddress =
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>;

  // Original accounts.
  type AccountKeys =
    | 'reservationList'
    | 'payer'
    | 'updateAuthority'
    | 'masterEdition'
    | 'resource'
    | 'metadata'
    | 'systemProgram'
    | 'rent';
  const accounts: Record<AccountKeys, ResolvedAccount> = {
    reservationList: { value: input.reservationList ?? null, isWritable: true },
    payer: { value: input.payer ?? null, isWritable: false },
    updateAuthority: {
      value: input.updateAuthority ?? null,
      isWritable: false,
    },
    masterEdition: { value: input.masterEdition ?? null, isWritable: false },
    resource: { value: input.resource ?? null, isWritable: false },
    metadata: { value: input.metadata ?? null, isWritable: false },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
    rent: { value: input.rent ?? null, isWritable: false },
  };

  // Original args.
  const args = { ...input };

  // Resolve default values.
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value =
      '11111111111111111111111111111111' as Address<'11111111111111111111111111111111'>;
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

  const instruction = {
    accounts: [
      accountMetas.reservationList,
      accountMetas.payer,
      accountMetas.updateAuthority,
      accountMetas.masterEdition,
      accountMetas.resource,
      accountMetas.metadata,
      accountMetas.systemProgram,
      accountMetas.rent,
    ],
    programAddress,
    data: getCreateReservationListInstructionDataEncoder().encode(
      args as CreateReservationListInstructionDataArgs
    ),
  } as CreateReservationListInstruction<
    TProgram,
    TAccountReservationList,
    TAccountPayer,
    TAccountUpdateAuthority,
    TAccountMasterEdition,
    TAccountResource,
    TAccountMetadata,
    TAccountSystemProgram,
    TAccountRent
  >;

  return instruction;
}

export type ParsedCreateReservationListInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetas extends readonly IAccountMeta[] = readonly IAccountMeta[],
> = {
  programAddress: Address<TProgram>;
  accounts: {
    /** PDA for ReservationList of ['metadata', program id, master edition key, 'reservation', resource-key] */
    reservationList: TAccountMetas[0];
    /** Payer */
    payer: TAccountMetas[1];
    /** Update authority */
    updateAuthority: TAccountMetas[2];
    /**  Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition']) */
    masterEdition: TAccountMetas[3];
    /** A resource you wish to tie the reservation list to. This is so your later visitors who come to redeem can derive your reservation list PDA with something they can easily get at. You choose what this should be. */
    resource: TAccountMetas[4];
    /** Metadata key (pda of ['metadata', program id, mint id]) */
    metadata: TAccountMetas[5];
    /** System program */
    systemProgram: TAccountMetas[6];
    /** Rent info */
    rent: TAccountMetas[7];
  };
  data: CreateReservationListInstructionData;
};

export function parseCreateReservationListInstruction<
  TProgram extends string,
  TAccountMetas extends readonly IAccountMeta[],
>(
  instruction: IInstruction<TProgram> &
    IInstructionWithAccounts<TAccountMetas> &
    IInstructionWithData<Uint8Array>
): ParsedCreateReservationListInstruction<TProgram, TAccountMetas> {
  if (instruction.accounts.length < 8) {
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
      reservationList: getNextAccount(),
      payer: getNextAccount(),
      updateAuthority: getNextAccount(),
      masterEdition: getNextAccount(),
      resource: getNextAccount(),
      metadata: getNextAccount(),
      systemProgram: getNextAccount(),
      rent: getNextAccount(),
    },
    data: getCreateReservationListInstructionDataDecoder().decode(
      instruction.data
    ),
  };
}
