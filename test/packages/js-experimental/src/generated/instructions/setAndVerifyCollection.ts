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
  WritableAccount,
  WritableSignerAccount,
} from '@solana/instructions';
import {
  Context,
  CustomGeneratedInstruction,
  ResolvedAccount,
  Signer,
  WrappedInstruction,
  accountMetaWithDefault,
  getAccountMetasAndSigners,
} from '../shared';

// Output.
export type SetAndVerifyCollectionInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountCollectionAuthority extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string,
  TAccountCollectionMint extends string | IAccountMeta<string> = string,
  TAccountCollection extends string | IAccountMeta<string> = string,
  TAccountCollectionMasterEditionAccount extends
    | string
    | IAccountMeta<string> = string,
  TAccountCollectionAuthorityRecord extends
    | string
    | IAccountMeta<string> = string
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountMetadata extends string
        ? WritableAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountCollectionAuthority extends string
        ? WritableSignerAccount<TAccountCollectionAuthority>
        : TAccountCollectionAuthority,
      TAccountPayer extends string
        ? WritableSignerAccount<TAccountPayer>
        : TAccountPayer,
      TAccountUpdateAuthority extends string
        ? ReadonlyAccount<TAccountUpdateAuthority>
        : TAccountUpdateAuthority,
      TAccountCollectionMint extends string
        ? ReadonlyAccount<TAccountCollectionMint>
        : TAccountCollectionMint,
      TAccountCollection extends string
        ? ReadonlyAccount<TAccountCollection>
        : TAccountCollection,
      TAccountCollectionMasterEditionAccount extends string
        ? ReadonlyAccount<TAccountCollectionMasterEditionAccount>
        : TAccountCollectionMasterEditionAccount,
      TAccountCollectionAuthorityRecord extends string
        ? ReadonlyAccount<TAccountCollectionAuthorityRecord>
        : TAccountCollectionAuthorityRecord
    ]
  >;

export type SetAndVerifyCollectionInstructionData = { discriminator: number };

export type SetAndVerifyCollectionInstructionDataArgs = {};

export function getSetAndVerifyCollectionInstructionDataEncoder(): Encoder<SetAndVerifyCollectionInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<SetAndVerifyCollectionInstructionData>(
      [['discriminator', getU8Encoder()]],
      { description: 'SetAndVerifyCollectionInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 25 } as SetAndVerifyCollectionInstructionData)
  ) as Encoder<SetAndVerifyCollectionInstructionDataArgs>;
}

export function getSetAndVerifyCollectionInstructionDataDecoder(): Decoder<SetAndVerifyCollectionInstructionData> {
  return getStructDecoder<SetAndVerifyCollectionInstructionData>(
    [['discriminator', getU8Decoder()]],
    { description: 'SetAndVerifyCollectionInstructionData' }
  ) as Decoder<SetAndVerifyCollectionInstructionData>;
}

export function getSetAndVerifyCollectionInstructionDataCodec(): Codec<
  SetAndVerifyCollectionInstructionDataArgs,
  SetAndVerifyCollectionInstructionData
> {
  return combineCodec(
    getSetAndVerifyCollectionInstructionDataEncoder(),
    getSetAndVerifyCollectionInstructionDataDecoder()
  );
}

export function setAndVerifyCollectionInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountCollectionAuthority extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string,
  TAccountCollectionMint extends string | IAccountMeta<string> = string,
  TAccountCollection extends string | IAccountMeta<string> = string,
  TAccountCollectionMasterEditionAccount extends
    | string
    | IAccountMeta<string> = string,
  TAccountCollectionAuthorityRecord extends
    | string
    | IAccountMeta<string> = string
>(
  accounts: {
    metadata: TAccountMetadata extends string
      ? Base58EncodedAddress<TAccountMetadata>
      : TAccountMetadata;
    collectionAuthority: TAccountCollectionAuthority extends string
      ? Base58EncodedAddress<TAccountCollectionAuthority>
      : TAccountCollectionAuthority;
    payer: TAccountPayer extends string
      ? Base58EncodedAddress<TAccountPayer>
      : TAccountPayer;
    updateAuthority: TAccountUpdateAuthority extends string
      ? Base58EncodedAddress<TAccountUpdateAuthority>
      : TAccountUpdateAuthority;
    collectionMint: TAccountCollectionMint extends string
      ? Base58EncodedAddress<TAccountCollectionMint>
      : TAccountCollectionMint;
    collection: TAccountCollection extends string
      ? Base58EncodedAddress<TAccountCollection>
      : TAccountCollection;
    collectionMasterEditionAccount: TAccountCollectionMasterEditionAccount extends string
      ? Base58EncodedAddress<TAccountCollectionMasterEditionAccount>
      : TAccountCollectionMasterEditionAccount;
    collectionAuthorityRecord?: TAccountCollectionAuthorityRecord extends string
      ? Base58EncodedAddress<TAccountCollectionAuthorityRecord>
      : TAccountCollectionAuthorityRecord;
  },
  programAddress: Base58EncodedAddress<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.metadata, AccountRole.WRITABLE),
      accountMetaWithDefault(
        accounts.collectionAuthority,
        AccountRole.WRITABLE_SIGNER
      ),
      accountMetaWithDefault(accounts.payer, AccountRole.WRITABLE_SIGNER),
      accountMetaWithDefault(accounts.updateAuthority, AccountRole.READONLY),
      accountMetaWithDefault(accounts.collectionMint, AccountRole.READONLY),
      accountMetaWithDefault(accounts.collection, AccountRole.READONLY),
      accountMetaWithDefault(
        accounts.collectionMasterEditionAccount,
        AccountRole.READONLY
      ),
      accountMetaWithDefault(
        accounts.collectionAuthorityRecord ?? {
          address:
            'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
    ],
    data: getSetAndVerifyCollectionInstructionDataEncoder().encode({}),
    programAddress,
  } as SetAndVerifyCollectionInstruction<
    TProgram,
    TAccountMetadata,
    TAccountCollectionAuthority,
    TAccountPayer,
    TAccountUpdateAuthority,
    TAccountCollectionMint,
    TAccountCollection,
    TAccountCollectionMasterEditionAccount,
    TAccountCollectionAuthorityRecord
  >;
}

// Input.
export type SetAndVerifyCollectionInput<
  TAccountMetadata extends string,
  TAccountCollectionAuthority extends string,
  TAccountPayer extends string,
  TAccountUpdateAuthority extends string,
  TAccountCollectionMint extends string,
  TAccountCollection extends string,
  TAccountCollectionMasterEditionAccount extends string,
  TAccountCollectionAuthorityRecord extends string
> = {
  /** Metadata account */
  metadata: Base58EncodedAddress<TAccountMetadata>;
  /** Collection Update authority */
  collectionAuthority: Signer<TAccountCollectionAuthority>;
  /** Payer */
  payer?: Signer<TAccountPayer>;
  /** Update Authority of Collection NFT and NFT */
  updateAuthority: Base58EncodedAddress<TAccountUpdateAuthority>;
  /** Mint of the Collection */
  collectionMint: Base58EncodedAddress<TAccountCollectionMint>;
  /** Metadata Account of the Collection */
  collection: Base58EncodedAddress<TAccountCollection>;
  /** MasterEdition2 Account of the Collection Token */
  collectionMasterEditionAccount: Base58EncodedAddress<TAccountCollectionMasterEditionAccount>;
  /** Collection Authority Record PDA */
  collectionAuthorityRecord?: Base58EncodedAddress<TAccountCollectionAuthorityRecord>;
};

export async function setAndVerifyCollection<
  TReturn,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string,
  TAccountCollectionAuthority extends string = string,
  TAccountPayer extends string = string,
  TAccountUpdateAuthority extends string = string,
  TAccountCollectionMint extends string = string,
  TAccountCollection extends string = string,
  TAccountCollectionMasterEditionAccount extends string = string,
  TAccountCollectionAuthorityRecord extends string = string
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      SetAndVerifyCollectionInstruction<
        TProgram,
        TAccountMetadata,
        TAccountCollectionAuthority,
        TAccountPayer,
        TAccountUpdateAuthority,
        TAccountCollectionMint,
        TAccountCollection,
        TAccountCollectionMasterEditionAccount,
        TAccountCollectionAuthorityRecord
      >,
      TReturn
    >,
  input: SetAndVerifyCollectionInput<
    TAccountMetadata,
    TAccountCollectionAuthority,
    TAccountPayer,
    TAccountUpdateAuthority,
    TAccountCollectionMint,
    TAccountCollection,
    TAccountCollectionMasterEditionAccount,
    TAccountCollectionAuthorityRecord
  >
): Promise<TReturn>;
export async function setAndVerifyCollection<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string,
  TAccountCollectionAuthority extends string = string,
  TAccountPayer extends string = string,
  TAccountUpdateAuthority extends string = string,
  TAccountCollectionMint extends string = string,
  TAccountCollection extends string = string,
  TAccountCollectionMasterEditionAccount extends string = string,
  TAccountCollectionAuthorityRecord extends string = string
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: SetAndVerifyCollectionInput<
    TAccountMetadata,
    TAccountCollectionAuthority,
    TAccountPayer,
    TAccountUpdateAuthority,
    TAccountCollectionMint,
    TAccountCollection,
    TAccountCollectionMasterEditionAccount,
    TAccountCollectionAuthorityRecord
  >
): Promise<
  WrappedInstruction<
    SetAndVerifyCollectionInstruction<
      TProgram,
      TAccountMetadata,
      TAccountCollectionAuthority,
      TAccountPayer,
      TAccountUpdateAuthority,
      TAccountCollectionMint,
      TAccountCollection,
      TAccountCollectionMasterEditionAccount,
      TAccountCollectionAuthorityRecord
    >
  >
>;
export async function setAndVerifyCollection<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string,
  TAccountCollectionAuthority extends string = string,
  TAccountPayer extends string = string,
  TAccountUpdateAuthority extends string = string,
  TAccountCollectionMint extends string = string,
  TAccountCollection extends string = string,
  TAccountCollectionMasterEditionAccount extends string = string,
  TAccountCollectionAuthorityRecord extends string = string
>(
  input: SetAndVerifyCollectionInput<
    TAccountMetadata,
    TAccountCollectionAuthority,
    TAccountPayer,
    TAccountUpdateAuthority,
    TAccountCollectionMint,
    TAccountCollection,
    TAccountCollectionMasterEditionAccount,
    TAccountCollectionAuthorityRecord
  >
): Promise<
  WrappedInstruction<
    SetAndVerifyCollectionInstruction<
      TProgram,
      TAccountMetadata,
      TAccountCollectionAuthority,
      TAccountPayer,
      TAccountUpdateAuthority,
      TAccountCollectionMint,
      TAccountCollection,
      TAccountCollectionMasterEditionAccount,
      TAccountCollectionAuthorityRecord
    >
  >
>;
export async function setAndVerifyCollection<
  TReturn,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string,
  TAccountCollectionAuthority extends string = string,
  TAccountPayer extends string = string,
  TAccountUpdateAuthority extends string = string,
  TAccountCollectionMint extends string = string,
  TAccountCollection extends string = string,
  TAccountCollectionMasterEditionAccount extends string = string,
  TAccountCollectionAuthorityRecord extends string = string
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          SetAndVerifyCollectionInstruction<
            TProgram,
            TAccountMetadata,
            TAccountCollectionAuthority,
            TAccountPayer,
            TAccountUpdateAuthority,
            TAccountCollectionMint,
            TAccountCollection,
            TAccountCollectionMasterEditionAccount,
            TAccountCollectionAuthorityRecord
          >,
          TReturn
        >)
    | SetAndVerifyCollectionInput<
        TAccountMetadata,
        TAccountCollectionAuthority,
        TAccountPayer,
        TAccountUpdateAuthority,
        TAccountCollectionMint,
        TAccountCollection,
        TAccountCollectionMasterEditionAccount,
        TAccountCollectionAuthorityRecord
      >,
  rawInput?: SetAndVerifyCollectionInput<
    TAccountMetadata,
    TAccountCollectionAuthority,
    TAccountPayer,
    TAccountUpdateAuthority,
    TAccountCollectionMint,
    TAccountCollection,
    TAccountCollectionMasterEditionAccount,
    TAccountCollectionAuthorityRecord
  >
): Promise<
  | TReturn
  | WrappedInstruction<
      SetAndVerifyCollectionInstruction<
        TProgram,
        TAccountMetadata,
        TAccountCollectionAuthority,
        TAccountPayer,
        TAccountUpdateAuthority,
        TAccountCollectionMint,
        TAccountCollection,
        TAccountCollectionMasterEditionAccount,
        TAccountCollectionAuthorityRecord
      >
    >
> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          SetAndVerifyCollectionInstruction<
            TProgram,
            TAccountMetadata,
            TAccountCollectionAuthority,
            TAccountPayer,
            TAccountUpdateAuthority,
            TAccountCollectionMint,
            TAccountCollection,
            TAccountCollectionMasterEditionAccount,
            TAccountCollectionAuthorityRecord
          >,
          TReturn
        >);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as SetAndVerifyCollectionInput<
    TAccountMetadata,
    TAccountCollectionAuthority,
    TAccountPayer,
    TAccountUpdateAuthority,
    TAccountCollectionMint,
    TAccountCollection,
    TAccountCollectionMasterEditionAccount,
    TAccountCollectionAuthorityRecord
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
  type AccountMetas = Parameters<typeof setAndVerifyCollectionInstruction>[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    metadata: { value: input.metadata ?? null, isWritable: true },
    collectionAuthority: {
      value: input.collectionAuthority ?? null,
      isWritable: true,
    },
    payer: { value: input.payer ?? null, isWritable: true },
    updateAuthority: {
      value: input.updateAuthority ?? null,
      isWritable: false,
    },
    collectionMint: { value: input.collectionMint ?? null, isWritable: false },
    collection: { value: input.collection ?? null, isWritable: false },
    collectionMasterEditionAccount: {
      value: input.collectionMasterEditionAccount ?? null,
      isWritable: false,
    },
    collectionAuthorityRecord: {
      value: input.collectionAuthorityRecord ?? null,
      isWritable: false,
    },
  };

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
    instruction: setAndVerifyCollectionInstruction(
      accountMetas as AccountMetas,
      programAddress
    ) as SetAndVerifyCollectionInstruction<
      TProgram,
      TAccountMetadata,
      TAccountCollectionAuthority,
      TAccountPayer,
      TAccountUpdateAuthority,
      TAccountCollectionMint,
      TAccountCollection,
      TAccountCollectionMasterEditionAccount,
      TAccountCollectionAuthorityRecord
    >,
    signers,
    bytesCreatedOnChain: 0,
  };
}
