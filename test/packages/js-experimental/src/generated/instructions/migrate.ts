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
  ReadonlySignerAccount,
  WritableAccount,
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
import {
  MigrateArgs,
  MigrateArgsArgs,
  getMigrateArgsDecoder,
  getMigrateArgsEncoder,
} from '../types';

// Output.
export type MigrateInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountMasterEdition extends string | IAccountMeta<string> = string,
  TAccountTokenAccount extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string,
  TAccountCollectionMetadata extends string | IAccountMeta<string> = string,
  TAccountTokenProgram extends
    | string
    | IAccountMeta<string> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountSysvarInstructions extends
    | string
    | IAccountMeta<string> = 'Sysvar1nstructions1111111111111111111111111',
  TAccountAuthorizationRules extends string | IAccountMeta<string> = string
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountMetadata extends string
        ? WritableAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountMasterEdition extends string
        ? ReadonlyAccount<TAccountMasterEdition>
        : TAccountMasterEdition,
      TAccountTokenAccount extends string
        ? WritableAccount<TAccountTokenAccount>
        : TAccountTokenAccount,
      TAccountMint extends string
        ? ReadonlyAccount<TAccountMint>
        : TAccountMint,
      TAccountUpdateAuthority extends string
        ? ReadonlySignerAccount<TAccountUpdateAuthority>
        : TAccountUpdateAuthority,
      TAccountCollectionMetadata extends string
        ? ReadonlyAccount<TAccountCollectionMetadata>
        : TAccountCollectionMetadata,
      TAccountTokenProgram extends string
        ? ReadonlyAccount<TAccountTokenProgram>
        : TAccountTokenProgram,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      TAccountSysvarInstructions extends string
        ? ReadonlyAccount<TAccountSysvarInstructions>
        : TAccountSysvarInstructions,
      TAccountAuthorizationRules extends string
        ? ReadonlyAccount<TAccountAuthorizationRules>
        : TAccountAuthorizationRules
    ]
  >;

export type MigrateInstructionData = {
  discriminator: number;
  migrateArgs: MigrateArgs;
};

export type MigrateInstructionDataArgs = { migrateArgs: MigrateArgsArgs };

export function getMigrateInstructionDataEncoder(): Encoder<MigrateInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<MigrateInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        ['migrateArgs', getMigrateArgsEncoder()],
      ],
      { description: 'MigrateInstructionData' }
    ),
    (value) => ({ ...value, discriminator: 50 } as MigrateInstructionData)
  ) as Encoder<MigrateInstructionDataArgs>;
}

export function getMigrateInstructionDataDecoder(): Decoder<MigrateInstructionData> {
  return getStructDecoder<MigrateInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      ['migrateArgs', getMigrateArgsDecoder()],
    ],
    { description: 'MigrateInstructionData' }
  ) as Decoder<MigrateInstructionData>;
}

export function getMigrateInstructionDataCodec(): Codec<
  MigrateInstructionDataArgs,
  MigrateInstructionData
> {
  return combineCodec(
    getMigrateInstructionDataEncoder(),
    getMigrateInstructionDataDecoder()
  );
}

export function migrateInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountMasterEdition extends string | IAccountMeta<string> = string,
  TAccountTokenAccount extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountUpdateAuthority extends string | IAccountMeta<string> = string,
  TAccountCollectionMetadata extends string | IAccountMeta<string> = string,
  TAccountTokenProgram extends
    | string
    | IAccountMeta<string> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountSysvarInstructions extends
    | string
    | IAccountMeta<string> = 'Sysvar1nstructions1111111111111111111111111',
  TAccountAuthorizationRules extends string | IAccountMeta<string> = string
>(
  accounts: {
    metadata: TAccountMetadata extends string
      ? Base58EncodedAddress<TAccountMetadata>
      : TAccountMetadata;
    masterEdition: TAccountMasterEdition extends string
      ? Base58EncodedAddress<TAccountMasterEdition>
      : TAccountMasterEdition;
    tokenAccount: TAccountTokenAccount extends string
      ? Base58EncodedAddress<TAccountTokenAccount>
      : TAccountTokenAccount;
    mint: TAccountMint extends string
      ? Base58EncodedAddress<TAccountMint>
      : TAccountMint;
    updateAuthority: TAccountUpdateAuthority extends string
      ? Base58EncodedAddress<TAccountUpdateAuthority>
      : TAccountUpdateAuthority;
    collectionMetadata: TAccountCollectionMetadata extends string
      ? Base58EncodedAddress<TAccountCollectionMetadata>
      : TAccountCollectionMetadata;
    tokenProgram?: TAccountTokenProgram extends string
      ? Base58EncodedAddress<TAccountTokenProgram>
      : TAccountTokenProgram;
    systemProgram?: TAccountSystemProgram extends string
      ? Base58EncodedAddress<TAccountSystemProgram>
      : TAccountSystemProgram;
    sysvarInstructions?: TAccountSysvarInstructions extends string
      ? Base58EncodedAddress<TAccountSysvarInstructions>
      : TAccountSysvarInstructions;
    authorizationRules?: TAccountAuthorizationRules extends string
      ? Base58EncodedAddress<TAccountAuthorizationRules>
      : TAccountAuthorizationRules;
  },
  args: MigrateInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.metadata, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.masterEdition, AccountRole.READONLY),
      accountMetaWithDefault(accounts.tokenAccount, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.mint, AccountRole.READONLY),
      accountMetaWithDefault(
        accounts.updateAuthority,
        AccountRole.READONLY_SIGNER
      ),
      accountMetaWithDefault(accounts.collectionMetadata, AccountRole.READONLY),
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
        accounts.sysvarInstructions ??
          'Sysvar1nstructions1111111111111111111111111',
        AccountRole.READONLY
      ),
      accountMetaWithDefault(
        accounts.authorizationRules ?? {
          address:
            'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
    ],
    data: getMigrateInstructionDataEncoder().encode(args),
    programAddress,
  } as MigrateInstruction<
    TProgram,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenAccount,
    TAccountMint,
    TAccountUpdateAuthority,
    TAccountCollectionMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountAuthorizationRules
  >;
}

// Input.
export type MigrateInput<
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountTokenAccount extends string,
  TAccountMint extends string,
  TAccountUpdateAuthority extends string,
  TAccountCollectionMetadata extends string,
  TAccountTokenProgram extends string,
  TAccountSystemProgram extends string,
  TAccountSysvarInstructions extends string,
  TAccountAuthorizationRules extends string
> = {
  /** Metadata account */
  metadata: Base58EncodedAddress<TAccountMetadata>;
  /** Master edition account */
  masterEdition: Base58EncodedAddress<TAccountMasterEdition>;
  /** Token account */
  tokenAccount: Base58EncodedAddress<TAccountTokenAccount>;
  /** Mint account */
  mint: Base58EncodedAddress<TAccountMint>;
  /** Update authority */
  updateAuthority: Signer<TAccountUpdateAuthority>;
  /** Collection metadata account */
  collectionMetadata: Base58EncodedAddress<TAccountCollectionMetadata>;
  /** Token Program */
  tokenProgram?: Base58EncodedAddress<TAccountTokenProgram>;
  /** System program */
  systemProgram?: Base58EncodedAddress<TAccountSystemProgram>;
  /** Instruction sysvar account */
  sysvarInstructions?: Base58EncodedAddress<TAccountSysvarInstructions>;
  /** Token Authorization Rules account */
  authorizationRules?: Base58EncodedAddress<TAccountAuthorizationRules>;
  migrateArgs: MigrateInstructionDataArgs['migrateArgs'];
};

export async function migrate<
  TReturn,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string,
  TAccountMasterEdition extends string = string,
  TAccountTokenAccount extends string = string,
  TAccountMint extends string = string,
  TAccountUpdateAuthority extends string = string,
  TAccountCollectionMetadata extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountSysvarInstructions extends string = 'Sysvar1nstructions1111111111111111111111111',
  TAccountAuthorizationRules extends string = string
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      MigrateInstruction<
        TProgram,
        TAccountMetadata,
        TAccountMasterEdition,
        TAccountTokenAccount,
        TAccountMint,
        TAccountUpdateAuthority,
        TAccountCollectionMetadata,
        TAccountTokenProgram,
        TAccountSystemProgram,
        TAccountSysvarInstructions,
        TAccountAuthorizationRules
      >,
      TReturn
    >,
  input: MigrateInput<
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenAccount,
    TAccountMint,
    TAccountUpdateAuthority,
    TAccountCollectionMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountAuthorizationRules
  >
): Promise<TReturn>;
export async function migrate<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string,
  TAccountMasterEdition extends string = string,
  TAccountTokenAccount extends string = string,
  TAccountMint extends string = string,
  TAccountUpdateAuthority extends string = string,
  TAccountCollectionMetadata extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountSysvarInstructions extends string = 'Sysvar1nstructions1111111111111111111111111',
  TAccountAuthorizationRules extends string = string
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: MigrateInput<
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenAccount,
    TAccountMint,
    TAccountUpdateAuthority,
    TAccountCollectionMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountAuthorizationRules
  >
): Promise<
  WrappedInstruction<
    MigrateInstruction<
      TProgram,
      TAccountMetadata,
      TAccountMasterEdition,
      TAccountTokenAccount,
      TAccountMint,
      TAccountUpdateAuthority,
      TAccountCollectionMetadata,
      TAccountTokenProgram,
      TAccountSystemProgram,
      TAccountSysvarInstructions,
      TAccountAuthorizationRules
    >
  >
>;
export async function migrate<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string,
  TAccountMasterEdition extends string = string,
  TAccountTokenAccount extends string = string,
  TAccountMint extends string = string,
  TAccountUpdateAuthority extends string = string,
  TAccountCollectionMetadata extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountSysvarInstructions extends string = 'Sysvar1nstructions1111111111111111111111111',
  TAccountAuthorizationRules extends string = string
>(
  input: MigrateInput<
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenAccount,
    TAccountMint,
    TAccountUpdateAuthority,
    TAccountCollectionMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountAuthorizationRules
  >
): Promise<
  WrappedInstruction<
    MigrateInstruction<
      TProgram,
      TAccountMetadata,
      TAccountMasterEdition,
      TAccountTokenAccount,
      TAccountMint,
      TAccountUpdateAuthority,
      TAccountCollectionMetadata,
      TAccountTokenProgram,
      TAccountSystemProgram,
      TAccountSysvarInstructions,
      TAccountAuthorizationRules
    >
  >
>;
export async function migrate<
  TReturn,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetadata extends string = string,
  TAccountMasterEdition extends string = string,
  TAccountTokenAccount extends string = string,
  TAccountMint extends string = string,
  TAccountUpdateAuthority extends string = string,
  TAccountCollectionMetadata extends string = string,
  TAccountTokenProgram extends string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountSystemProgram extends string = '11111111111111111111111111111111',
  TAccountSysvarInstructions extends string = 'Sysvar1nstructions1111111111111111111111111',
  TAccountAuthorizationRules extends string = string
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          MigrateInstruction<
            TProgram,
            TAccountMetadata,
            TAccountMasterEdition,
            TAccountTokenAccount,
            TAccountMint,
            TAccountUpdateAuthority,
            TAccountCollectionMetadata,
            TAccountTokenProgram,
            TAccountSystemProgram,
            TAccountSysvarInstructions,
            TAccountAuthorizationRules
          >,
          TReturn
        >)
    | MigrateInput<
        TAccountMetadata,
        TAccountMasterEdition,
        TAccountTokenAccount,
        TAccountMint,
        TAccountUpdateAuthority,
        TAccountCollectionMetadata,
        TAccountTokenProgram,
        TAccountSystemProgram,
        TAccountSysvarInstructions,
        TAccountAuthorizationRules
      >,
  rawInput?: MigrateInput<
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenAccount,
    TAccountMint,
    TAccountUpdateAuthority,
    TAccountCollectionMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountAuthorizationRules
  >
): Promise<
  | TReturn
  | WrappedInstruction<
      MigrateInstruction<
        TProgram,
        TAccountMetadata,
        TAccountMasterEdition,
        TAccountTokenAccount,
        TAccountMint,
        TAccountUpdateAuthority,
        TAccountCollectionMetadata,
        TAccountTokenProgram,
        TAccountSystemProgram,
        TAccountSysvarInstructions,
        TAccountAuthorizationRules
      >
    >
> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<
          MigrateInstruction<
            TProgram,
            TAccountMetadata,
            TAccountMasterEdition,
            TAccountTokenAccount,
            TAccountMint,
            TAccountUpdateAuthority,
            TAccountCollectionMetadata,
            TAccountTokenProgram,
            TAccountSystemProgram,
            TAccountSysvarInstructions,
            TAccountAuthorizationRules
          >,
          TReturn
        >);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as MigrateInput<
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountTokenAccount,
    TAccountMint,
    TAccountUpdateAuthority,
    TAccountCollectionMetadata,
    TAccountTokenProgram,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountAuthorizationRules
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
  type AccountMetas = Parameters<typeof migrateInstruction>[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    metadata: { value: input.metadata ?? null, isWritable: true },
    masterEdition: { value: input.masterEdition ?? null, isWritable: false },
    tokenAccount: { value: input.tokenAccount ?? null, isWritable: true },
    mint: { value: input.mint ?? null, isWritable: false },
    updateAuthority: {
      value: input.updateAuthority ?? null,
      isWritable: false,
    },
    collectionMetadata: {
      value: input.collectionMetadata ?? null,
      isWritable: false,
    },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
    sysvarInstructions: {
      value: input.sysvarInstructions ?? null,
      isWritable: false,
    },
    authorizationRules: {
      value: input.authorizationRules ?? null,
      isWritable: false,
    },
  };

  // Original args.
  const args = {
    amount: input.amount,
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
    instruction: migrateInstruction(
      accountMetas as AccountMetas,
      args,
      programAddress
    ) as MigrateInstruction<
      TProgram,
      TAccountMetadata,
      TAccountMasterEdition,
      TAccountTokenAccount,
      TAccountMint,
      TAccountUpdateAuthority,
      TAccountCollectionMetadata,
      TAccountTokenProgram,
      TAccountSystemProgram,
      TAccountSysvarInstructions,
      TAccountAuthorizationRules
    >,
    signers,
    bytesCreatedOnChain: 0,
  };
}
