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
  Signer,
  WrappedInstruction,
  accountMetaWithDefault,
} from '../shared';

// Output.
export type CloseEscrowAccountInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountEscrow extends string | IAccountMeta<string> = string,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountTokenAccount extends string | IAccountMeta<string> = string,
  TAccountEdition extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountSysvarInstructions extends
    | string
    | IAccountMeta<string> = 'Sysvar1nstructions1111111111111111111111111'
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountEscrow extends string
        ? WritableAccount<TAccountEscrow>
        : TAccountEscrow,
      TAccountMetadata extends string
        ? WritableAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountMint extends string
        ? ReadonlyAccount<TAccountMint>
        : TAccountMint,
      TAccountTokenAccount extends string
        ? ReadonlyAccount<TAccountTokenAccount>
        : TAccountTokenAccount,
      TAccountEdition extends string
        ? ReadonlyAccount<TAccountEdition>
        : TAccountEdition,
      TAccountPayer extends string
        ? WritableSignerAccount<TAccountPayer>
        : TAccountPayer,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      TAccountSysvarInstructions extends string
        ? ReadonlyAccount<TAccountSysvarInstructions>
        : TAccountSysvarInstructions
    ]
  >;

export type CloseEscrowAccountInstructionData = { discriminator: number };

export type CloseEscrowAccountInstructionDataArgs = {};

export function getCloseEscrowAccountInstructionDataEncoder(): Encoder<CloseEscrowAccountInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<CloseEscrowAccountInstructionData>(
      [['discriminator', getU8Encoder()]],
      { description: 'CloseEscrowAccountInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 39 } as CloseEscrowAccountInstructionData)
  ) as Encoder<CloseEscrowAccountInstructionDataArgs>;
}

export function getCloseEscrowAccountInstructionDataDecoder(): Decoder<CloseEscrowAccountInstructionData> {
  return getStructDecoder<CloseEscrowAccountInstructionData>(
    [['discriminator', getU8Decoder()]],
    { description: 'CloseEscrowAccountInstructionData' }
  ) as Decoder<CloseEscrowAccountInstructionData>;
}

export function getCloseEscrowAccountInstructionDataCodec(): Codec<
  CloseEscrowAccountInstructionDataArgs,
  CloseEscrowAccountInstructionData
> {
  return combineCodec(
    getCloseEscrowAccountInstructionDataEncoder(),
    getCloseEscrowAccountInstructionDataDecoder()
  );
}

export function closeEscrowAccountInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountEscrow extends string | IAccountMeta<string> = string,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountTokenAccount extends string | IAccountMeta<string> = string,
  TAccountEdition extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountSysvarInstructions extends
    | string
    | IAccountMeta<string> = 'Sysvar1nstructions1111111111111111111111111'
>(
  accounts: {
    escrow: TAccountEscrow extends string
      ? Base58EncodedAddress<TAccountEscrow>
      : TAccountEscrow;
    metadata: TAccountMetadata extends string
      ? Base58EncodedAddress<TAccountMetadata>
      : TAccountMetadata;
    mint: TAccountMint extends string
      ? Base58EncodedAddress<TAccountMint>
      : TAccountMint;
    tokenAccount: TAccountTokenAccount extends string
      ? Base58EncodedAddress<TAccountTokenAccount>
      : TAccountTokenAccount;
    edition: TAccountEdition extends string
      ? Base58EncodedAddress<TAccountEdition>
      : TAccountEdition;
    payer: TAccountPayer extends string
      ? Base58EncodedAddress<TAccountPayer>
      : TAccountPayer;
    systemProgram?: TAccountSystemProgram extends string
      ? Base58EncodedAddress<TAccountSystemProgram>
      : TAccountSystemProgram;
    sysvarInstructions?: TAccountSysvarInstructions extends string
      ? Base58EncodedAddress<TAccountSysvarInstructions>
      : TAccountSysvarInstructions;
  },
  programAddress: Base58EncodedAddress<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.escrow, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.metadata, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.mint, AccountRole.READONLY),
      accountMetaWithDefault(accounts.tokenAccount, AccountRole.READONLY),
      accountMetaWithDefault(accounts.edition, AccountRole.READONLY),
      accountMetaWithDefault(accounts.payer, AccountRole.WRITABLE_SIGNER),
      accountMetaWithDefault(
        accounts.systemProgram ?? {
          address:
            '11111111111111111111111111111111' as Base58EncodedAddress<'11111111111111111111111111111111'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
      accountMetaWithDefault(
        accounts.sysvarInstructions ??
          'Sysvar1nstructions1111111111111111111111111',
        AccountRole.READONLY
      ),
    ],
    data: getCloseEscrowAccountInstructionDataEncoder().encode({}),
    programAddress,
  } as CloseEscrowAccountInstruction<
    TProgram,
    TAccountEscrow,
    TAccountMetadata,
    TAccountMint,
    TAccountTokenAccount,
    TAccountEdition,
    TAccountPayer,
    TAccountSystemProgram,
    TAccountSysvarInstructions
  >;
}

// Input.
export type CloseEscrowAccountInput<
  TAccountEscrow extends string,
  TAccountMetadata extends string,
  TAccountMint extends string,
  TAccountTokenAccount extends string,
  TAccountEdition extends string,
  TAccountPayer extends string,
  TAccountSystemProgram extends string,
  TAccountSysvarInstructions extends string
> = {
  /** Escrow account */
  escrow: Base58EncodedAddress<TAccountEscrow>;
  /** Metadata account */
  metadata: Base58EncodedAddress<TAccountMetadata>;
  /** Mint account */
  mint: Base58EncodedAddress<TAccountMint>;
  /** Token account */
  tokenAccount: Base58EncodedAddress<TAccountTokenAccount>;
  /** Edition account */
  edition: Base58EncodedAddress<TAccountEdition>;
  /** Wallet paying for the transaction and new account */
  payer?: Signer<TAccountPayer>;
  /** System program */
  systemProgram?: Base58EncodedAddress<TAccountSystemProgram>;
  /** Instructions sysvar account */
  sysvarInstructions?: Base58EncodedAddress<TAccountSysvarInstructions>;
};

export async function closeEscrowAccount<
  TReturn,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountEscrow extends string = string,
  TAccountMetadata extends string = string,
  TAccountMint extends string = string,
  TAccountTokenAccount extends string = string,
  TAccountEdition extends string = string,
  TAccountPayer extends string = string,
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountSysvarInstructions extends string = 'Sysvar1nstructions1111111111111111111111111'
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      CloseEscrowAccountInstruction<
        TProgram,
        TAccountEscrow,
        TAccountMetadata,
        TAccountMint,
        TAccountTokenAccount,
        TAccountEdition,
        TAccountPayer,
        TAccountSystemProgram,
        TAccountSysvarInstructions
      >,
      TReturn
    >,
  input: CloseEscrowAccountInput<
    TAccountEscrow,
    TAccountMetadata,
    TAccountMint,
    TAccountTokenAccount,
    TAccountEdition,
    TAccountPayer,
    TAccountSystemProgram,
    TAccountSysvarInstructions
  >
): Promise<TReturn>;
export async function closeEscrowAccount<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountEscrow extends string = string,
  TAccountMetadata extends string = string,
  TAccountMint extends string = string,
  TAccountTokenAccount extends string = string,
  TAccountEdition extends string = string,
  TAccountPayer extends string = string,
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountSysvarInstructions extends string = 'Sysvar1nstructions1111111111111111111111111'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: CloseEscrowAccountInput<
    TAccountEscrow,
    TAccountMetadata,
    TAccountMint,
    TAccountTokenAccount,
    TAccountEdition,
    TAccountPayer,
    TAccountSystemProgram,
    TAccountSysvarInstructions
  >
): Promise<
  WrappedInstruction<
    CloseEscrowAccountInstruction<
      TProgram,
      TAccountEscrow,
      TAccountMetadata,
      TAccountMint,
      TAccountTokenAccount,
      TAccountEdition,
      TAccountPayer,
      TAccountSystemProgram,
      TAccountSysvarInstructions
    >
  >
>;
export async function closeEscrowAccount<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountEscrow extends string = string,
  TAccountMetadata extends string = string,
  TAccountMint extends string = string,
  TAccountTokenAccount extends string = string,
  TAccountEdition extends string = string,
  TAccountPayer extends string = string,
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountSysvarInstructions extends string = 'Sysvar1nstructions1111111111111111111111111'
>(
  input: CloseEscrowAccountInput<
    TAccountEscrow,
    TAccountMetadata,
    TAccountMint,
    TAccountTokenAccount,
    TAccountEdition,
    TAccountPayer,
    TAccountSystemProgram,
    TAccountSysvarInstructions
  >
): Promise<
  WrappedInstruction<
    CloseEscrowAccountInstruction<
      TProgram,
      TAccountEscrow,
      TAccountMetadata,
      TAccountMint,
      TAccountTokenAccount,
      TAccountEdition,
      TAccountPayer,
      TAccountSystemProgram,
      TAccountSysvarInstructions
    >
  >
>;
export async function closeEscrowAccount<
  TReturn,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountEscrow extends string = string,
  TAccountMetadata extends string = string,
  TAccountMint extends string = string,
  TAccountTokenAccount extends string = string,
  TAccountEdition extends string = string,
  TAccountPayer extends string = string,
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountSysvarInstructions extends string = 'Sysvar1nstructions1111111111111111111111111'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          CloseEscrowAccountInstruction<
            TProgram,
            TAccountEscrow,
            TAccountMetadata,
            TAccountMint,
            TAccountTokenAccount,
            TAccountEdition,
            TAccountPayer,
            TAccountSystemProgram,
            TAccountSysvarInstructions
          >,
          TReturn
        >)
    | CloseEscrowAccountInput<
        TAccountEscrow,
        TAccountMetadata,
        TAccountMint,
        TAccountTokenAccount,
        TAccountEdition,
        TAccountPayer,
        TAccountSystemProgram,
        TAccountSysvarInstructions
      >,
  rawInput?: CloseEscrowAccountInput<
    TAccountEscrow,
    TAccountMetadata,
    TAccountMint,
    TAccountTokenAccount,
    TAccountEdition,
    TAccountPayer,
    TAccountSystemProgram,
    TAccountSysvarInstructions
  >
): Promise<
  | TReturn
  | WrappedInstruction<
      CloseEscrowAccountInstruction<
        TProgram,
        TAccountEscrow,
        TAccountMetadata,
        TAccountMint,
        TAccountTokenAccount,
        TAccountEdition,
        TAccountPayer,
        TAccountSystemProgram,
        TAccountSysvarInstructions
      >
    >
> {
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          CloseEscrowAccountInstruction<
            TProgram,
            TAccountEscrow,
            TAccountMetadata,
            TAccountMint,
            TAccountTokenAccount,
            TAccountEdition,
            TAccountPayer,
            TAccountSystemProgram,
            TAccountSysvarInstructions
          >,
          TReturn
        >);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as CloseEscrowAccountInput<
    TAccountEscrow,
    TAccountMetadata,
    TAccountMint,
    TAccountTokenAccount,
    TAccountEdition,
    TAccountPayer,
    TAccountSystemProgram,
    TAccountSysvarInstructions
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
