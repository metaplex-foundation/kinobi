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
import {
  getU64Decoder,
  getU64Encoder,
  getU8Decoder,
  getU8Encoder,
} from '@solana/codecs-numbers';
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
  Signer,
  WrappedInstruction,
  accountMetaWithDefault,
} from '../shared';

// Output.
export type ApproveUseAuthorityInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountUseAuthorityRecord extends string | IAccountMeta<string> = string,
  TAccountOwner extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountUser extends string | IAccountMeta<string> = string,
  TAccountOwnerTokenAccount extends string | IAccountMeta<string> = string,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountBurner extends string | IAccountMeta<string> = string,
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
      TAccountPayer extends string
        ? WritableSignerAccount<TAccountPayer>
        : TAccountPayer,
      TAccountUser extends string
        ? ReadonlyAccount<TAccountUser>
        : TAccountUser,
      TAccountOwnerTokenAccount extends string
        ? WritableAccount<TAccountOwnerTokenAccount>
        : TAccountOwnerTokenAccount,
      TAccountMetadata extends string
        ? ReadonlyAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountMint extends string
        ? ReadonlyAccount<TAccountMint>
        : TAccountMint,
      TAccountBurner extends string
        ? ReadonlyAccount<TAccountBurner>
        : TAccountBurner,
      TAccountTokenProgram extends string
        ? ReadonlyAccount<TAccountTokenProgram>
        : TAccountTokenProgram,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      TAccountRent extends string ? ReadonlyAccount<TAccountRent> : TAccountRent
    ]
  >;

export type ApproveUseAuthorityInstructionData = {
  discriminator: number;
  numberOfUses: bigint;
};

export type ApproveUseAuthorityInstructionDataArgs = {
  numberOfUses: number | bigint;
};

export function getApproveUseAuthorityInstructionDataEncoder(): Encoder<ApproveUseAuthorityInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<ApproveUseAuthorityInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['numberOfUses', getU64Encoder()],
      ],
      { description: 'ApproveUseAuthorityInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 20 } as ApproveUseAuthorityInstructionData)
  ) as Encoder<ApproveUseAuthorityInstructionDataArgs>;
}

export function getApproveUseAuthorityInstructionDataDecoder(): Decoder<ApproveUseAuthorityInstructionData> {
  return getStructDecoder<ApproveUseAuthorityInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['numberOfUses', getU64Decoder()],
    ],
    { description: 'ApproveUseAuthorityInstructionData' }
  ) as Decoder<ApproveUseAuthorityInstructionData>;
}

export function getApproveUseAuthorityInstructionDataCodec(): Codec<
  ApproveUseAuthorityInstructionDataArgs,
  ApproveUseAuthorityInstructionData
> {
  return combineCodec(
    getApproveUseAuthorityInstructionDataEncoder(),
    getApproveUseAuthorityInstructionDataDecoder()
  );
}

export function approveUseAuthorityInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountUseAuthorityRecord extends string | IAccountMeta<string> = string,
  TAccountOwner extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountUser extends string | IAccountMeta<string> = string,
  TAccountOwnerTokenAccount extends string | IAccountMeta<string> = string,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountBurner extends string | IAccountMeta<string> = string,
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
    payer: TAccountPayer extends string
      ? Base58EncodedAddress<TAccountPayer>
      : TAccountPayer;
    user: TAccountUser extends string
      ? Base58EncodedAddress<TAccountUser>
      : TAccountUser;
    ownerTokenAccount: TAccountOwnerTokenAccount extends string
      ? Base58EncodedAddress<TAccountOwnerTokenAccount>
      : TAccountOwnerTokenAccount;
    metadata: TAccountMetadata extends string
      ? Base58EncodedAddress<TAccountMetadata>
      : TAccountMetadata;
    mint: TAccountMint extends string
      ? Base58EncodedAddress<TAccountMint>
      : TAccountMint;
    burner: TAccountBurner extends string
      ? Base58EncodedAddress<TAccountBurner>
      : TAccountBurner;
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
  args: ApproveUseAuthorityInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.useAuthorityRecord, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.owner, AccountRole.WRITABLE_SIGNER),
      accountMetaWithDefault(accounts.payer, AccountRole.WRITABLE_SIGNER),
      accountMetaWithDefault(accounts.user, AccountRole.READONLY),
      accountMetaWithDefault(accounts.ownerTokenAccount, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.metadata, AccountRole.READONLY),
      accountMetaWithDefault(accounts.mint, AccountRole.READONLY),
      accountMetaWithDefault(accounts.burner, AccountRole.READONLY),
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
    data: getApproveUseAuthorityInstructionDataEncoder().encode(args),
    programAddress,
  } as ApproveUseAuthorityInstruction<
    TProgram,
    TAccountUseAuthorityRecord,
    TAccountOwner,
    TAccountPayer,
    TAccountUser,
    TAccountOwnerTokenAccount,
    TAccountMetadata,
    TAccountMint,
    TAccountBurner,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent
  >;
}

// Input.
export type ApproveUseAuthorityInput<
  TAccountUseAuthorityRecord extends string,
  TAccountOwner extends string,
  TAccountPayer extends string,
  TAccountUser extends string,
  TAccountOwnerTokenAccount extends string,
  TAccountMetadata extends string,
  TAccountMint extends string,
  TAccountBurner extends string,
  TAccountTokenProgram extends string,
  TAccountSystemProgram extends string,
  TAccountRent extends string
> = {
  /** Use Authority Record PDA */
  useAuthorityRecord: Base58EncodedAddress<TAccountUseAuthorityRecord>;
  /** Owner */
  owner: Signer<TAccountOwner>;
  /** Payer */
  payer?: Signer<TAccountPayer>;
  /** A Use Authority */
  user: Base58EncodedAddress<TAccountUser>;
  /** Owned Token Account Of Mint */
  ownerTokenAccount: Base58EncodedAddress<TAccountOwnerTokenAccount>;
  /** Metadata account */
  metadata: Base58EncodedAddress<TAccountMetadata>;
  /** Mint of Metadata */
  mint: Base58EncodedAddress<TAccountMint>;
  /** Program As Signer (Burner) */
  burner: Base58EncodedAddress<TAccountBurner>;
  /** Token program */
  tokenProgram?: Base58EncodedAddress<TAccountTokenProgram>;
  /** System program */
  systemProgram?: Base58EncodedAddress<TAccountSystemProgram>;
  /** Rent info */
  rent?: Base58EncodedAddress<TAccountRent>;
  numberOfUses: ApproveUseAuthorityInstructionDataArgs['numberOfUses'];
};

export async function approveUseAuthority<
  TReturn,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountUseAuthorityRecord extends string = string,
  TAccountOwner extends string = string,
  TAccountPayer extends string = string,
  TAccountUser extends string = string,
  TAccountOwnerTokenAccount extends string = string,
  TAccountMetadata extends string = string,
  TAccountMint extends string = string,
  TAccountBurner extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountRent extends string = string
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      ApproveUseAuthorityInstruction<
        TProgram,
        TAccountUseAuthorityRecord,
        TAccountOwner,
        TAccountPayer,
        TAccountUser,
        TAccountOwnerTokenAccount,
        TAccountMetadata,
        TAccountMint,
        TAccountBurner,
        TAccountTokenProgram,
        TAccountSystemProgram,
        TAccountRent
      >,
      TReturn
    >,
  input: ApproveUseAuthorityInput<
    TAccountUseAuthorityRecord,
    TAccountOwner,
    TAccountPayer,
    TAccountUser,
    TAccountOwnerTokenAccount,
    TAccountMetadata,
    TAccountMint,
    TAccountBurner,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent
  >
): Promise<TReturn>;
export async function approveUseAuthority<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountUseAuthorityRecord extends string = string,
  TAccountOwner extends string = string,
  TAccountPayer extends string = string,
  TAccountUser extends string = string,
  TAccountOwnerTokenAccount extends string = string,
  TAccountMetadata extends string = string,
  TAccountMint extends string = string,
  TAccountBurner extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountRent extends string = string
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: ApproveUseAuthorityInput<
    TAccountUseAuthorityRecord,
    TAccountOwner,
    TAccountPayer,
    TAccountUser,
    TAccountOwnerTokenAccount,
    TAccountMetadata,
    TAccountMint,
    TAccountBurner,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent
  >
): Promise<
  WrappedInstruction<
    ApproveUseAuthorityInstruction<
      TProgram,
      TAccountUseAuthorityRecord,
      TAccountOwner,
      TAccountPayer,
      TAccountUser,
      TAccountOwnerTokenAccount,
      TAccountMetadata,
      TAccountMint,
      TAccountBurner,
      TAccountTokenProgram,
      TAccountSystemProgram,
      TAccountRent
    >
  >
>;
export async function approveUseAuthority<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountUseAuthorityRecord extends string = string,
  TAccountOwner extends string = string,
  TAccountPayer extends string = string,
  TAccountUser extends string = string,
  TAccountOwnerTokenAccount extends string = string,
  TAccountMetadata extends string = string,
  TAccountMint extends string = string,
  TAccountBurner extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountRent extends string = string
>(
  input: ApproveUseAuthorityInput<
    TAccountUseAuthorityRecord,
    TAccountOwner,
    TAccountPayer,
    TAccountUser,
    TAccountOwnerTokenAccount,
    TAccountMetadata,
    TAccountMint,
    TAccountBurner,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent
  >
): Promise<
  WrappedInstruction<
    ApproveUseAuthorityInstruction<
      TProgram,
      TAccountUseAuthorityRecord,
      TAccountOwner,
      TAccountPayer,
      TAccountUser,
      TAccountOwnerTokenAccount,
      TAccountMetadata,
      TAccountMint,
      TAccountBurner,
      TAccountTokenProgram,
      TAccountSystemProgram,
      TAccountRent
    >
  >
>;
export async function approveUseAuthority<
  TReturn,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountUseAuthorityRecord extends string = string,
  TAccountOwner extends string = string,
  TAccountPayer extends string = string,
  TAccountUser extends string = string,
  TAccountOwnerTokenAccount extends string = string,
  TAccountMetadata extends string = string,
  TAccountMint extends string = string,
  TAccountBurner extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountRent extends string = string
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          ApproveUseAuthorityInstruction<
            TProgram,
            TAccountUseAuthorityRecord,
            TAccountOwner,
            TAccountPayer,
            TAccountUser,
            TAccountOwnerTokenAccount,
            TAccountMetadata,
            TAccountMint,
            TAccountBurner,
            TAccountTokenProgram,
            TAccountSystemProgram,
            TAccountRent
          >,
          TReturn
        >)
    | ApproveUseAuthorityInput<
        TAccountUseAuthorityRecord,
        TAccountOwner,
        TAccountPayer,
        TAccountUser,
        TAccountOwnerTokenAccount,
        TAccountMetadata,
        TAccountMint,
        TAccountBurner,
        TAccountTokenProgram,
        TAccountSystemProgram,
        TAccountRent
      >,
  rawInput?: ApproveUseAuthorityInput<
    TAccountUseAuthorityRecord,
    TAccountOwner,
    TAccountPayer,
    TAccountUser,
    TAccountOwnerTokenAccount,
    TAccountMetadata,
    TAccountMint,
    TAccountBurner,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent
  >
): Promise<
  | TReturn
  | WrappedInstruction<
      ApproveUseAuthorityInstruction<
        TProgram,
        TAccountUseAuthorityRecord,
        TAccountOwner,
        TAccountPayer,
        TAccountUser,
        TAccountOwnerTokenAccount,
        TAccountMetadata,
        TAccountMint,
        TAccountBurner,
        TAccountTokenProgram,
        TAccountSystemProgram,
        TAccountRent
      >
    >
> {
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          ApproveUseAuthorityInstruction<
            TProgram,
            TAccountUseAuthorityRecord,
            TAccountOwner,
            TAccountPayer,
            TAccountUser,
            TAccountOwnerTokenAccount,
            TAccountMetadata,
            TAccountMint,
            TAccountBurner,
            TAccountTokenProgram,
            TAccountSystemProgram,
            TAccountRent
          >,
          TReturn
        >);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as ApproveUseAuthorityInput<
    TAccountUseAuthorityRecord,
    TAccountOwner,
    TAccountPayer,
    TAccountUser,
    TAccountOwnerTokenAccount,
    TAccountMetadata,
    TAccountMint,
    TAccountBurner,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountRent
  >;

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

  return {
    instruction: transferSolInstruction(input as any, input, programAddress),
    signers: [],
    bytesCreatedOnChain: 0,
  };
}
