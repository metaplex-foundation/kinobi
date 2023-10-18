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
export type RevokeUseAuthorityInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountUseAuthorityRecord extends string | IAccountMeta<string> = string,
  TAccountOwner extends string | IAccountMeta<string> = string,
  TAccountUser extends string | IAccountMeta<string> = string,
  TAccountOwnerTokenAccount extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountTokenProgram extends
    | string
    | IAccountMeta<string> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountRent extends string | IAccountMeta<string> = string
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountUseAuthorityRecord extends string
        ? WritableAccount<TAccountUseAuthorityRecord>
        : TAccountUseAuthorityRecord,
      TAccountOwner extends string
        ? WritableSignerAccount<TAccountOwner>
        : TAccountOwner,
      TAccountUser extends string
        ? ReadonlyAccount<TAccountUser>
        : TAccountUser,
      TAccountOwnerTokenAccount extends string
        ? WritableAccount<TAccountOwnerTokenAccount>
        : TAccountOwnerTokenAccount,
      TAccountMint extends string
        ? ReadonlyAccount<TAccountMint>
        : TAccountMint,
      TAccountMetadata extends string
        ? ReadonlyAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountTokenProgram extends string
        ? ReadonlyAccount<TAccountTokenProgram>
        : TAccountTokenProgram,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      TAccountRent extends string ? ReadonlyAccount<TAccountRent> : TAccountRent
    ]
  >;

export type RevokeUseAuthorityInstructionData = { discriminator: number };

export type RevokeUseAuthorityInstructionDataArgs = {};

export function getRevokeUseAuthorityInstructionDataEncoder(): Encoder<RevokeUseAuthorityInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<RevokeUseAuthorityInstructionData>(
      [['discriminator', getU8Encoder()]],
      { description: 'RevokeUseAuthorityInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 21 } as RevokeUseAuthorityInstructionData)
  ) as Encoder<RevokeUseAuthorityInstructionDataArgs>;
}

export function getRevokeUseAuthorityInstructionDataDecoder(): Decoder<RevokeUseAuthorityInstructionData> {
  return getStructDecoder<RevokeUseAuthorityInstructionData>(
    [['discriminator', getU8Decoder()]],
    { description: 'RevokeUseAuthorityInstructionData' }
  ) as Decoder<RevokeUseAuthorityInstructionData>;
}

export function getRevokeUseAuthorityInstructionDataCodec(): Codec<
  RevokeUseAuthorityInstructionDataArgs,
  RevokeUseAuthorityInstructionData
> {
  return combineCodec(
    getRevokeUseAuthorityInstructionDataEncoder(),
    getRevokeUseAuthorityInstructionDataDecoder()
  );
}

export function revokeUseAuthorityInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountUseAuthorityRecord extends string | IAccountMeta<string> = string,
  TAccountOwner extends string | IAccountMeta<string> = string,
  TAccountUser extends string | IAccountMeta<string> = string,
  TAccountOwnerTokenAccount extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountTokenProgram extends
    | string
    | IAccountMeta<string> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountRent extends string | IAccountMeta<string> = string
>(
  accounts: {
    useAuthorityRecord: TAccountUseAuthorityRecord extends string
      ? Base58EncodedAddress<TAccountUseAuthorityRecord>
      : TAccountUseAuthorityRecord;
    owner: TAccountOwner extends string
      ? Base58EncodedAddress<TAccountOwner>
      : TAccountOwner;
    user: TAccountUser extends string
      ? Base58EncodedAddress<TAccountUser>
      : TAccountUser;
    ownerTokenAccount: TAccountOwnerTokenAccount extends string
      ? Base58EncodedAddress<TAccountOwnerTokenAccount>
      : TAccountOwnerTokenAccount;
    mint: TAccountMint extends string
      ? Base58EncodedAddress<TAccountMint>
      : TAccountMint;
    metadata: TAccountMetadata extends string
      ? Base58EncodedAddress<TAccountMetadata>
      : TAccountMetadata;
    tokenProgram?: TAccountTokenProgram extends string
      ? Base58EncodedAddress<TAccountTokenProgram>
      : TAccountTokenProgram;
    systemProgram?: TAccountSystemProgram extends string
      ? Base58EncodedAddress<TAccountSystemProgram>
      : TAccountSystemProgram;
    rent?: TAccountRent extends string
      ? Base58EncodedAddress<TAccountRent>
      : TAccountRent;
  },
  programAddress: Base58EncodedAddress<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.useAuthorityRecord, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.owner, AccountRole.WRITABLE_SIGNER),
      accountMetaWithDefault(accounts.user, AccountRole.READONLY),
      accountMetaWithDefault(accounts.ownerTokenAccount, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.mint, AccountRole.READONLY),
      accountMetaWithDefault(accounts.metadata, AccountRole.READONLY),
      accountMetaWithDefault(
        accounts.tokenProgram ?? {
          address:
            'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
      accountMetaWithDefault(
        accounts.systemProgram ?? {
          address:
            '11111111111111111111111111111111' as Base58EncodedAddress<'11111111111111111111111111111111'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
      accountMetaWithDefault(
        accounts.rent ?? {
          address:
            'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
    ],
    data: getRevokeUseAuthorityInstructionDataEncoder().encode({}),
    programAddress,
  } as RevokeUseAuthorityInstruction<
    TProgram,
    TAccountUseAuthorityRecord,
    TAccountOwner,
    TAccountUser,
    TAccountOwnerTokenAccount,
    TAccountMint,
    TAccountMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent
  >;
}

// Input.
export type RevokeUseAuthorityInput<
  TAccountUseAuthorityRecord extends string,
  TAccountOwner extends string,
  TAccountUser extends string,
  TAccountOwnerTokenAccount extends string,
  TAccountMint extends string,
  TAccountMetadata extends string,
  TAccountTokenProgram extends string,
  TAccountSystemProgram extends string,
  TAccountRent extends string
> = {
  /** Use Authority Record PDA */
  useAuthorityRecord: Base58EncodedAddress<TAccountUseAuthorityRecord>;
  /** Owner */
  owner: Signer<TAccountOwner>;
  /** A Use Authority */
  user: Base58EncodedAddress<TAccountUser>;
  /** Owned Token Account Of Mint */
  ownerTokenAccount: Base58EncodedAddress<TAccountOwnerTokenAccount>;
  /** Mint of Metadata */
  mint: Base58EncodedAddress<TAccountMint>;
  /** Metadata account */
  metadata: Base58EncodedAddress<TAccountMetadata>;
  /** Token program */
  tokenProgram?: Base58EncodedAddress<TAccountTokenProgram>;
  /** System program */
  systemProgram?: Base58EncodedAddress<TAccountSystemProgram>;
  /** Rent info */
  rent?: Base58EncodedAddress<TAccountRent>;
};

export async function revokeUseAuthority<
  TReturn,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountUseAuthorityRecord extends string = string,
  TAccountOwner extends string = string,
  TAccountUser extends string = string,
  TAccountOwnerTokenAccount extends string = string,
  TAccountMint extends string = string,
  TAccountMetadata extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountRent extends string = string
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      RevokeUseAuthorityInstruction<
        TProgram,
        TAccountUseAuthorityRecord,
        TAccountOwner,
        TAccountUser,
        TAccountOwnerTokenAccount,
        TAccountMint,
        TAccountMetadata,
        TAccountTokenProgram,
        TAccountSystemProgram,
        TAccountRent
      >,
      TReturn
    >,
  input: RevokeUseAuthorityInput<
    TAccountUseAuthorityRecord,
    TAccountOwner,
    TAccountUser,
    TAccountOwnerTokenAccount,
    TAccountMint,
    TAccountMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent
  >
): Promise<TReturn>;
export async function revokeUseAuthority<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountUseAuthorityRecord extends string = string,
  TAccountOwner extends string = string,
  TAccountUser extends string = string,
  TAccountOwnerTokenAccount extends string = string,
  TAccountMint extends string = string,
  TAccountMetadata extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountRent extends string = string
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: RevokeUseAuthorityInput<
    TAccountUseAuthorityRecord,
    TAccountOwner,
    TAccountUser,
    TAccountOwnerTokenAccount,
    TAccountMint,
    TAccountMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent
  >
): Promise<
  WrappedInstruction<
    RevokeUseAuthorityInstruction<
      TProgram,
      TAccountUseAuthorityRecord,
      TAccountOwner,
      TAccountUser,
      TAccountOwnerTokenAccount,
      TAccountMint,
      TAccountMetadata,
      TAccountTokenProgram,
      TAccountSystemProgram,
      TAccountRent
    >
  >
>;
export async function revokeUseAuthority<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountUseAuthorityRecord extends string = string,
  TAccountOwner extends string = string,
  TAccountUser extends string = string,
  TAccountOwnerTokenAccount extends string = string,
  TAccountMint extends string = string,
  TAccountMetadata extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountRent extends string = string
>(
  input: RevokeUseAuthorityInput<
    TAccountUseAuthorityRecord,
    TAccountOwner,
    TAccountUser,
    TAccountOwnerTokenAccount,
    TAccountMint,
    TAccountMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent
  >
): Promise<
  WrappedInstruction<
    RevokeUseAuthorityInstruction<
      TProgram,
      TAccountUseAuthorityRecord,
      TAccountOwner,
      TAccountUser,
      TAccountOwnerTokenAccount,
      TAccountMint,
      TAccountMetadata,
      TAccountTokenProgram,
      TAccountSystemProgram,
      TAccountRent
    >
  >
>;
export async function revokeUseAuthority<
  TReturn,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountUseAuthorityRecord extends string = string,
  TAccountOwner extends string = string,
  TAccountUser extends string = string,
  TAccountOwnerTokenAccount extends string = string,
  TAccountMint extends string = string,
  TAccountMetadata extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountRent extends string = string
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          RevokeUseAuthorityInstruction<
            TProgram,
            TAccountUseAuthorityRecord,
            TAccountOwner,
            TAccountUser,
            TAccountOwnerTokenAccount,
            TAccountMint,
            TAccountMetadata,
            TAccountTokenProgram,
            TAccountSystemProgram,
            TAccountRent
          >,
          TReturn
        >)
    | RevokeUseAuthorityInput<
        TAccountUseAuthorityRecord,
        TAccountOwner,
        TAccountUser,
        TAccountOwnerTokenAccount,
        TAccountMint,
        TAccountMetadata,
        TAccountTokenProgram,
        TAccountSystemProgram,
        TAccountRent
      >,
  rawInput?: RevokeUseAuthorityInput<
    TAccountUseAuthorityRecord,
    TAccountOwner,
    TAccountUser,
    TAccountOwnerTokenAccount,
    TAccountMint,
    TAccountMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent
  >
): Promise<
  | TReturn
  | WrappedInstruction<
      RevokeUseAuthorityInstruction<
        TProgram,
        TAccountUseAuthorityRecord,
        TAccountOwner,
        TAccountUser,
        TAccountOwnerTokenAccount,
        TAccountMint,
        TAccountMetadata,
        TAccountTokenProgram,
        TAccountSystemProgram,
        TAccountRent
      >
    >
> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          RevokeUseAuthorityInstruction<
            TProgram,
            TAccountUseAuthorityRecord,
            TAccountOwner,
            TAccountUser,
            TAccountOwnerTokenAccount,
            TAccountMint,
            TAccountMetadata,
            TAccountTokenProgram,
            TAccountSystemProgram,
            TAccountRent
          >,
          TReturn
        >);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as RevokeUseAuthorityInput<
    TAccountUseAuthorityRecord,
    TAccountOwner,
    TAccountUser,
    TAccountOwnerTokenAccount,
    TAccountMint,
    TAccountMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
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
  type AccountMetas = Parameters<typeof revokeUseAuthorityInstruction>[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    useAuthorityRecord: {
      value: input.useAuthorityRecord ?? null,
      isWritable: true,
    },
    owner: { value: input.owner ?? null, isWritable: true },
    user: { value: input.user ?? null, isWritable: false },
    ownerTokenAccount: {
      value: input.ownerTokenAccount ?? null,
      isWritable: true,
    },
    mint: { value: input.mint ?? null, isWritable: false },
    metadata: { value: input.metadata ?? null, isWritable: false },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
    rent: { value: input.rent ?? null, isWritable: false },
  };

  // Resolve default values.
  // TODO

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
    instruction: revokeUseAuthorityInstruction(
      accountMetas as AccountMetas,
      programAddress
    ) as RevokeUseAuthorityInstruction<
      TProgram,
      TAccountUseAuthorityRecord,
      TAccountOwner,
      TAccountUser,
      TAccountOwnerTokenAccount,
      TAccountMint,
      TAccountMetadata,
      TAccountTokenProgram,
      TAccountSystemProgram,
      TAccountRent
    >,
    signers,
    bytesCreatedOnChain: 0,
  };
}
