/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Context,
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  CreateReservationListInstructionDataArgs,
  getCreateReservationListInstructionDataSerializer,
} from '../../hooked';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';

// Accounts.
export type CreateReservationListInstructionAccounts = {
  /** PDA for ReservationList of ['metadata', program id, master edition key, 'reservation', resource-key] */
  reservationList: PublicKey | Pda;
  /** Payer */
  payer?: Signer;
  /** Update authority */
  updateAuthority: Signer;
  /**  Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition']) */
  masterEdition: PublicKey | Pda;
  /** A resource you wish to tie the reservation list to. This is so your later visitors who come to redeem can derive your reservation list PDA with something they can easily get at. You choose what this should be. */
  resource: PublicKey | Pda;
  /** Metadata key (pda of ['metadata', program id, mint id]) */
  metadata: PublicKey | Pda;
  /** System program */
  systemProgram?: PublicKey | Pda;
  /** Rent info */
  rent?: PublicKey | Pda;
};

// Args.
export type CreateReservationListInstructionArgs =
  CreateReservationListInstructionDataArgs;

// Instruction.
export function createReservationList(
  context: Pick<Context, 'payer' | 'programs'>,
  accounts: CreateReservationListInstructionAccounts,
  args: CreateReservationListInstructionArgs
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplTokenMetadata',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );

  // Accounts.
  const resolvedAccounts = {
    reservationList: {
      index: 0,
      isWritable: true as boolean,
      value: accounts.reservationList ?? null,
    },
    payer: {
      index: 1,
      isWritable: false as boolean,
      value: accounts.payer ?? null,
    },
    updateAuthority: {
      index: 2,
      isWritable: false as boolean,
      value: accounts.updateAuthority ?? null,
    },
    masterEdition: {
      index: 3,
      isWritable: false as boolean,
      value: accounts.masterEdition ?? null,
    },
    resource: {
      index: 4,
      isWritable: false as boolean,
      value: accounts.resource ?? null,
    },
    metadata: {
      index: 5,
      isWritable: false as boolean,
      value: accounts.metadata ?? null,
    },
    systemProgram: {
      index: 6,
      isWritable: false as boolean,
      value: accounts.systemProgram ?? null,
    },
    rent: {
      index: 7,
      isWritable: false as boolean,
      value: accounts.rent ?? null,
    },
  } satisfies ResolvedAccountsWithIndices;

  // Arguments.
  const resolvedArgs: CreateReservationListInstructionArgs = { ...args };

  // Default values.
  if (!resolvedAccounts.payer.value) {
    resolvedAccounts.payer.value = context.payer;
  }
  if (!resolvedAccounts.systemProgram.value) {
    resolvedAccounts.systemProgram.value = context.programs.getPublicKey(
      'splSystem',
      '11111111111111111111111111111111'
    );
    resolvedAccounts.systemProgram.isWritable = false;
  }
  if (!resolvedAccounts.rent.value) {
    resolvedAccounts.rent.value = publicKey(
      'SysvarRent111111111111111111111111111111111'
    );
  }

  // Accounts in order.
  const orderedAccounts: ResolvedAccount[] = Object.values(
    resolvedAccounts
  ).sort((a, b) => a.index - b.index);

  // Keys and Signers.
  const [keys, signers] = getAccountMetasAndSigners(
    orderedAccounts,
    'programId',
    programId
  );

  // Data.
  const data = getCreateReservationListInstructionDataSerializer().serialize(
    resolvedArgs as CreateReservationListInstructionDataArgs
  );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
