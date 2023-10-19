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
  getProgramAddress,
} from '../shared';

// Output.
export type ThawDelegatedAccountInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountDelegate extends string | IAccountMeta<string> = string,
  TAccountTokenAccount extends string | IAccountMeta<string> = string,
  TAccountEdition extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountTokenProgram extends
    | string
    | IAccountMeta<string> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountDelegate extends string
        ? WritableSignerAccount<TAccountDelegate>
        : TAccountDelegate,
      TAccountTokenAccount extends string
        ? WritableAccount<TAccountTokenAccount>
        : TAccountTokenAccount,
      TAccountEdition extends string
        ? ReadonlyAccount<TAccountEdition>
        : TAccountEdition,
      TAccountMint extends string
        ? ReadonlyAccount<TAccountMint>
        : TAccountMint,
      TAccountTokenProgram extends string
        ? ReadonlyAccount<TAccountTokenProgram>
        : TAccountTokenProgram
    ]
  >;

export type ThawDelegatedAccountInstructionData = { discriminator: number };

export type ThawDelegatedAccountInstructionDataArgs = {};

export function getThawDelegatedAccountInstructionDataEncoder(): Encoder<ThawDelegatedAccountInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<ThawDelegatedAccountInstructionData>(
      [['discriminator', getU8Encoder()]],
      { description: 'ThawDelegatedAccountInstructionData' }
    ),
    (value) =>
      ({ ...value, discriminator: 27 } as ThawDelegatedAccountInstructionData)
  ) as Encoder<ThawDelegatedAccountInstructionDataArgs>;
}

export function getThawDelegatedAccountInstructionDataDecoder(): Decoder<ThawDelegatedAccountInstructionData> {
  return getStructDecoder<ThawDelegatedAccountInstructionData>(
    [['discriminator', getU8Decoder()]],
    { description: 'ThawDelegatedAccountInstructionData' }
  ) as Decoder<ThawDelegatedAccountInstructionData>;
}

export function getThawDelegatedAccountInstructionDataCodec(): Codec<
  ThawDelegatedAccountInstructionDataArgs,
  ThawDelegatedAccountInstructionData
> {
  return combineCodec(
    getThawDelegatedAccountInstructionDataEncoder(),
    getThawDelegatedAccountInstructionDataDecoder()
  );
}

export function thawDelegatedAccountInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountDelegate extends string | IAccountMeta<string> = string,
  TAccountTokenAccount extends string | IAccountMeta<string> = string,
  TAccountEdition extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountTokenProgram extends
    | string
    | IAccountMeta<string> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
>(
  accounts: {
    delegate: TAccountDelegate extends string
      ? Base58EncodedAddress<TAccountDelegate>
      : TAccountDelegate;
    tokenAccount: TAccountTokenAccount extends string
      ? Base58EncodedAddress<TAccountTokenAccount>
      : TAccountTokenAccount;
    edition: TAccountEdition extends string
      ? Base58EncodedAddress<TAccountEdition>
      : TAccountEdition;
    mint: TAccountMint extends string
      ? Base58EncodedAddress<TAccountMint>
      : TAccountMint;
    tokenProgram?: TAccountTokenProgram extends string
      ? Base58EncodedAddress<TAccountTokenProgram>
      : TAccountTokenProgram;
  },
  programAddress: Base58EncodedAddress<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.delegate, AccountRole.WRITABLE_SIGNER),
      accountMetaWithDefault(accounts.tokenAccount, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.edition, AccountRole.READONLY),
      accountMetaWithDefault(accounts.mint, AccountRole.READONLY),
      accountMetaWithDefault(
        accounts.tokenProgram ?? {
          address:
            'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
    ],
    data: getThawDelegatedAccountInstructionDataEncoder().encode({}),
    programAddress,
  } as ThawDelegatedAccountInstruction<
    TProgram,
    TAccountDelegate,
    TAccountTokenAccount,
    TAccountEdition,
    TAccountMint,
    TAccountTokenProgram
  >;
}

// Input.
export type ThawDelegatedAccountInput<
  TAccountDelegate extends string,
  TAccountTokenAccount extends string,
  TAccountEdition extends string,
  TAccountMint extends string,
  TAccountTokenProgram extends string
> = {
  /** Delegate */
  delegate: Signer<TAccountDelegate>;
  /** Token account to thaw */
  tokenAccount: Base58EncodedAddress<TAccountTokenAccount>;
  /** Edition */
  edition: Base58EncodedAddress<TAccountEdition>;
  /** Token mint */
  mint: Base58EncodedAddress<TAccountMint>;
  /** Token Program */
  tokenProgram?: Base58EncodedAddress<TAccountTokenProgram>;
};

export async function thawDelegatedAccount<
  TReturn,
  TAccountDelegate extends string,
  TAccountTokenAccount extends string,
  TAccountEdition extends string,
  TAccountMint extends string,
  TAccountTokenProgram extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      ThawDelegatedAccountInstruction<
        TProgram,
        TAccountDelegate,
        TAccountTokenAccount,
        TAccountEdition,
        TAccountMint,
        TAccountTokenProgram
      >,
      TReturn
    >,
  input: ThawDelegatedAccountInput<
    TAccountDelegate,
    TAccountTokenAccount,
    TAccountEdition,
    TAccountMint,
    TAccountTokenProgram
  >
): Promise<TReturn>;
export async function thawDelegatedAccount<
  TAccountDelegate extends string,
  TAccountTokenAccount extends string,
  TAccountEdition extends string,
  TAccountMint extends string,
  TAccountTokenProgram extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: ThawDelegatedAccountInput<
    TAccountDelegate,
    TAccountTokenAccount,
    TAccountEdition,
    TAccountMint,
    TAccountTokenProgram
  >
): Promise<
  WrappedInstruction<
    ThawDelegatedAccountInstruction<
      TProgram,
      TAccountDelegate,
      TAccountTokenAccount,
      TAccountEdition,
      TAccountMint,
      TAccountTokenProgram
    >
  >
>;
export async function thawDelegatedAccount<
  TAccountDelegate extends string,
  TAccountTokenAccount extends string,
  TAccountEdition extends string,
  TAccountMint extends string,
  TAccountTokenProgram extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  input: ThawDelegatedAccountInput<
    TAccountDelegate,
    TAccountTokenAccount,
    TAccountEdition,
    TAccountMint,
    TAccountTokenProgram
  >
): Promise<
  WrappedInstruction<
    ThawDelegatedAccountInstruction<
      TProgram,
      TAccountDelegate,
      TAccountTokenAccount,
      TAccountEdition,
      TAccountMint,
      TAccountTokenProgram
    >
  >
>;
export async function thawDelegatedAccount<
  TReturn,
  TAccountDelegate extends string,
  TAccountTokenAccount extends string,
  TAccountEdition extends string,
  TAccountMint extends string,
  TAccountTokenProgram extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>)
    | ThawDelegatedAccountInput<
        TAccountDelegate,
        TAccountTokenAccount,
        TAccountEdition,
        TAccountMint,
        TAccountTokenProgram
      >,
  rawInput?: ThawDelegatedAccountInput<
    TAccountDelegate,
    TAccountTokenAccount,
    TAccountEdition,
    TAccountMint,
    TAccountTokenProgram
  >
): Promise<TReturn | WrappedInstruction<IInstruction>> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as ThawDelegatedAccountInput<
    TAccountDelegate,
    TAccountTokenAccount,
    TAccountEdition,
    TAccountMint,
    TAccountTokenProgram
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
  type AccountMetas = Parameters<
    typeof thawDelegatedAccountInstruction<
      TProgram,
      TAccountDelegate,
      TAccountTokenAccount,
      TAccountEdition,
      TAccountMint,
      TAccountTokenProgram
    >
  >[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    delegate: { value: input.delegate ?? null, isWritable: true },
    tokenAccount: { value: input.tokenAccount ?? null, isWritable: true },
    edition: { value: input.edition ?? null, isWritable: false },
    mint: { value: input.mint ?? null, isWritable: false },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false },
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
    instruction: thawDelegatedAccountInstruction(
      accountMetas as Record<keyof AccountMetas, IAccountMeta>,
      programAddress
    ),
    signers,
    bytesCreatedOnChain: 0,
  };
}
