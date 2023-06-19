/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  AccountMeta,
  Context,
  Option,
  OptionOrNullable,
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  array,
  mapSerializer,
  option,
  struct,
  u64,
  u8,
} from '@metaplex-foundation/umi/serializers';
import { addAccountMeta } from '../shared';
import {
  Reservation,
  ReservationArgs,
  getReservationSerializer,
} from '../types';

// Accounts.
export type DeprecatedSetReservationListInstructionAccounts = {
  /** Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition']) */
  masterEdition: PublicKey | Pda;
  /** PDA for ReservationList of ['metadata', program id, master edition key, 'reservation', resource-key] */
  reservationList: PublicKey | Pda;
  /** The resource you tied the reservation list too */
  resource: Signer;
};

// Data.
export type DeprecatedSetReservationListInstructionData = {
  discriminator: number;
  reservations: Array<Reservation>;
  totalReservationSpots: Option<bigint>;
  offset: bigint;
  totalSpotOffset: bigint;
};

export type DeprecatedSetReservationListInstructionDataArgs = {
  reservations: Array<ReservationArgs>;
  totalReservationSpots: OptionOrNullable<number | bigint>;
  offset: number | bigint;
  totalSpotOffset: number | bigint;
};

export function getDeprecatedSetReservationListInstructionDataSerializer(
  _context: object = {}
): Serializer<
  DeprecatedSetReservationListInstructionDataArgs,
  DeprecatedSetReservationListInstructionData
> {
  return mapSerializer<
    DeprecatedSetReservationListInstructionDataArgs,
    any,
    DeprecatedSetReservationListInstructionData
  >(
    struct<DeprecatedSetReservationListInstructionData>(
      [
        ['discriminator', u8()],
        ['reservations', array(getReservationSerializer())],
        ['totalReservationSpots', option(u64())],
        ['offset', u64()],
        ['totalSpotOffset', u64()],
      ],
      { description: 'DeprecatedSetReservationListInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 5 })
  ) as Serializer<
    DeprecatedSetReservationListInstructionDataArgs,
    DeprecatedSetReservationListInstructionData
  >;
}

// Args.
export type DeprecatedSetReservationListInstructionArgs =
  DeprecatedSetReservationListInstructionDataArgs;

// Instruction.
export function deprecatedSetReservationList(
  context: Pick<Context, 'programs'>,
  input: DeprecatedSetReservationListInstructionAccounts &
    DeprecatedSetReservationListInstructionArgs
): TransactionBuilder {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplTokenMetadata',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );

  // Resolved inputs.
  const resolvedAccounts = {
    masterEdition: [input.masterEdition, true] as const,
    reservationList: [input.reservationList, true] as const,
    resource: [input.resource, false] as const,
  };
  const resolvingArgs = {};
  const resolvedArgs = { ...input, ...resolvingArgs };

  addAccountMeta(keys, signers, resolvedAccounts.masterEdition, false);
  addAccountMeta(keys, signers, resolvedAccounts.reservationList, false);
  addAccountMeta(keys, signers, resolvedAccounts.resource, false);

  // Data.
  const data =
    getDeprecatedSetReservationListInstructionDataSerializer().serialize(
      resolvedArgs
    );

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
