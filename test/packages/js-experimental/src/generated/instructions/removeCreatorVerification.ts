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
  ReadonlySignerAccount,
  WritableAccount,
} from '@solana/instructions';
import { IAccountSignerMeta, TransactionSigner } from '@solana/signers';
import {
  ResolvedAccount,
  accountMetaWithDefault,
  getAccountMetasWithSigners,
} from '../shared';

export type RemoveCreatorVerificationInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountCreator extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountMetadata extends string
        ? WritableAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountCreator extends string
        ? ReadonlySignerAccount<TAccountCreator>
        : TAccountCreator,
      ...TRemainingAccounts
    ]
  >;

export type RemoveCreatorVerificationInstructionWithSigners<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountCreator extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountMetadata extends string
        ? WritableAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountCreator extends string
        ? ReadonlySignerAccount<TAccountCreator> &
            IAccountSignerMeta<TAccountCreator>
        : TAccountCreator,
      ...TRemainingAccounts
    ]
  >;

export type RemoveCreatorVerificationInstructionData = {
  discriminator: number;
};

export type RemoveCreatorVerificationInstructionDataArgs = {};

export function getRemoveCreatorVerificationInstructionDataEncoder() {
  return mapEncoder(
    getStructEncoder<{ discriminator: number }>([
      ['discriminator', getU8Encoder()],
    ]),
    (value) => ({ ...value, discriminator: 28 })
  ) satisfies Encoder<RemoveCreatorVerificationInstructionDataArgs>;
}

export function getRemoveCreatorVerificationInstructionDataDecoder() {
  return getStructDecoder<RemoveCreatorVerificationInstructionData>([
    ['discriminator', getU8Decoder()],
  ]) satisfies Decoder<RemoveCreatorVerificationInstructionData>;
}

export function getRemoveCreatorVerificationInstructionDataCodec(): Codec<
  RemoveCreatorVerificationInstructionDataArgs,
  RemoveCreatorVerificationInstructionData
> {
  return combineCodec(
    getRemoveCreatorVerificationInstructionDataEncoder(),
    getRemoveCreatorVerificationInstructionDataDecoder()
  );
}

export type RemoveCreatorVerificationInput<
  TAccountMetadata extends string,
  TAccountCreator extends string
> = {
  /** Metadata (pda of ['metadata', program id, mint id]) */
  metadata: Address<TAccountMetadata>;
  /** Creator */
  creator: Address<TAccountCreator>;
};

export type RemoveCreatorVerificationInputWithSigners<
  TAccountMetadata extends string,
  TAccountCreator extends string
> = {
  /** Metadata (pda of ['metadata', program id, mint id]) */
  metadata: Address<TAccountMetadata>;
  /** Creator */
  creator: TransactionSigner<TAccountCreator>;
};

export function getRemoveCreatorVerificationInstruction<
  TAccountMetadata extends string,
  TAccountCreator extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  input: RemoveCreatorVerificationInputWithSigners<
    TAccountMetadata,
    TAccountCreator
  >
): RemoveCreatorVerificationInstructionWithSigners<
  TProgram,
  TAccountMetadata,
  TAccountCreator
>;
export function getRemoveCreatorVerificationInstruction<
  TAccountMetadata extends string,
  TAccountCreator extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  input: RemoveCreatorVerificationInput<TAccountMetadata, TAccountCreator>
): RemoveCreatorVerificationInstruction<
  TProgram,
  TAccountMetadata,
  TAccountCreator
>;
export function getRemoveCreatorVerificationInstruction<
  TAccountMetadata extends string,
  TAccountCreator extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  input: RemoveCreatorVerificationInput<TAccountMetadata, TAccountCreator>
): IInstruction {
  // Program address.
  const programAddress =
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>;

  // Original accounts.
  type AccountMetas = Parameters<
    typeof getRemoveCreatorVerificationInstructionRaw<
      TProgram,
      TAccountMetadata,
      TAccountCreator
    >
  >[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    metadata: { value: input.metadata ?? null, isWritable: true },
    creator: { value: input.creator ?? null, isWritable: false },
  };

  // Get account metas and signers.
  const accountMetas = getAccountMetasWithSigners(
    accounts,
    'programId',
    programAddress
  );

  const instruction = getRemoveCreatorVerificationInstructionRaw(
    accountMetas as Record<keyof AccountMetas, IAccountMeta>,
    programAddress
  );

  return instruction;
}

export function getRemoveCreatorVerificationInstructionRaw<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountCreator extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
>(
  accounts: {
    metadata: TAccountMetadata extends string
      ? Address<TAccountMetadata>
      : TAccountMetadata;
    creator: TAccountCreator extends string
      ? Address<TAccountCreator>
      : TAccountCreator;
  },
  programAddress: Address<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<TProgram>,
  remainingAccounts?: TRemainingAccounts
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.metadata, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.creator, AccountRole.READONLY_SIGNER),
      ...(remainingAccounts ?? []),
    ],
    data: getRemoveCreatorVerificationInstructionDataEncoder().encode({}),
    programAddress,
  } as RemoveCreatorVerificationInstruction<
    TProgram,
    TAccountMetadata,
    TAccountCreator,
    TRemainingAccounts
  >;
}

export type ParsedRemoveCreatorVerificationInstruction = {
  accounts: {
    /** Metadata (pda of ['metadata', program id, mint id]) */
    metadata: Address;
    /** Creator */
    creator: Address;
  };
  data: RemoveCreatorVerificationInstructionData;
};

export function parseRemoveCreatorVerificationInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  instruction: IInstruction<TProgram> & IInstructionWithData<Uint8Array>
): ParsedRemoveCreatorVerificationInstruction {
  if (!instruction.accounts || instruction.accounts.length < 2) {
    // TODO: Coded error.
    throw new Error('Not enough accounts');
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const { address } = instruction.accounts![accountIndex]!;
    accountIndex += 1;
    return address;
  };
  return {
    accounts: {
      metadata: getNextAccount(),
      creator: getNextAccount(),
    },
    data: getRemoveCreatorVerificationInstructionDataDecoder().decode(
      instruction.data
    ),
  };
}
