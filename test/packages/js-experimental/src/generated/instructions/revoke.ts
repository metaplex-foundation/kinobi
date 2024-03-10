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
  getStructDecoder,
  getStructEncoder,
  getU8Decoder,
  getU8Encoder,
  mapEncoder,
} from '@solana/codecs';
import {
  AccountRole,
  IAccountMeta,
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  ReadonlyAccount,
  ReadonlySignerAccount,
  WritableAccount,
  WritableSignerAccount,
} from '@solana/instructions';
import { IAccountSignerMeta, TransactionSigner } from '@solana/signers';
import {
  ResolvedAccount,
  accountMetaWithDefault,
  getAccountMetasWithSigners,
} from '../shared';
import {
  RevokeArgs,
  RevokeArgsArgs,
  getRevokeArgsDecoder,
  getRevokeArgsEncoder,
} from '../types';

export type RevokeInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountDelegateRecord extends string | IAccountMeta<string> = string,
  TAccountDelegate extends string | IAccountMeta<string> = string,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountMasterEdition extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountToken extends string | IAccountMeta<string> = string,
  TAccountAuthority extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountSysvarInstructions extends
    | string
    | IAccountMeta<string> = 'Sysvar1nstructions1111111111111111111111111',
  TAccountSplTokenProgram extends string | IAccountMeta<string> = string,
  TAccountAuthorizationRulesProgram extends
    | string
    | IAccountMeta<string> = string,
  TAccountAuthorizationRules extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountDelegateRecord extends string
        ? WritableAccount<TAccountDelegateRecord>
        : TAccountDelegateRecord,
      TAccountDelegate extends string
        ? ReadonlyAccount<TAccountDelegate>
        : TAccountDelegate,
      TAccountMetadata extends string
        ? WritableAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountMasterEdition extends string
        ? ReadonlyAccount<TAccountMasterEdition>
        : TAccountMasterEdition,
      TAccountMint extends string
        ? ReadonlyAccount<TAccountMint>
        : TAccountMint,
      TAccountToken extends string
        ? WritableAccount<TAccountToken>
        : TAccountToken,
      TAccountAuthority extends string
        ? ReadonlySignerAccount<TAccountAuthority>
        : TAccountAuthority,
      TAccountPayer extends string
        ? WritableSignerAccount<TAccountPayer>
        : TAccountPayer,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      TAccountSysvarInstructions extends string
        ? ReadonlyAccount<TAccountSysvarInstructions>
        : TAccountSysvarInstructions,
      TAccountSplTokenProgram extends string
        ? ReadonlyAccount<TAccountSplTokenProgram>
        : TAccountSplTokenProgram,
      TAccountAuthorizationRulesProgram extends string
        ? ReadonlyAccount<TAccountAuthorizationRulesProgram>
        : TAccountAuthorizationRulesProgram,
      TAccountAuthorizationRules extends string
        ? ReadonlyAccount<TAccountAuthorizationRules>
        : TAccountAuthorizationRules,
      ...TRemainingAccounts
    ]
  >;

export type RevokeInstructionWithSigners<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountDelegateRecord extends string | IAccountMeta<string> = string,
  TAccountDelegate extends string | IAccountMeta<string> = string,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountMasterEdition extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountToken extends string | IAccountMeta<string> = string,
  TAccountAuthority extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountSysvarInstructions extends
    | string
    | IAccountMeta<string> = 'Sysvar1nstructions1111111111111111111111111',
  TAccountSplTokenProgram extends string | IAccountMeta<string> = string,
  TAccountAuthorizationRulesProgram extends
    | string
    | IAccountMeta<string> = string,
  TAccountAuthorizationRules extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountDelegateRecord extends string
        ? WritableAccount<TAccountDelegateRecord>
        : TAccountDelegateRecord,
      TAccountDelegate extends string
        ? ReadonlyAccount<TAccountDelegate>
        : TAccountDelegate,
      TAccountMetadata extends string
        ? WritableAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountMasterEdition extends string
        ? ReadonlyAccount<TAccountMasterEdition>
        : TAccountMasterEdition,
      TAccountMint extends string
        ? ReadonlyAccount<TAccountMint>
        : TAccountMint,
      TAccountToken extends string
        ? WritableAccount<TAccountToken>
        : TAccountToken,
      TAccountAuthority extends string
        ? ReadonlySignerAccount<TAccountAuthority> &
            IAccountSignerMeta<TAccountAuthority>
        : TAccountAuthority,
      TAccountPayer extends string
        ? WritableSignerAccount<TAccountPayer> &
            IAccountSignerMeta<TAccountPayer>
        : TAccountPayer,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      TAccountSysvarInstructions extends string
        ? ReadonlyAccount<TAccountSysvarInstructions>
        : TAccountSysvarInstructions,
      TAccountSplTokenProgram extends string
        ? ReadonlyAccount<TAccountSplTokenProgram>
        : TAccountSplTokenProgram,
      TAccountAuthorizationRulesProgram extends string
        ? ReadonlyAccount<TAccountAuthorizationRulesProgram>
        : TAccountAuthorizationRulesProgram,
      TAccountAuthorizationRules extends string
        ? ReadonlyAccount<TAccountAuthorizationRules>
        : TAccountAuthorizationRules,
      ...TRemainingAccounts
    ]
  >;

export type RevokeInstructionData = {
  discriminator: number;
  revokeArgs: RevokeArgs;
};

export type RevokeInstructionDataArgs = { revokeArgs: RevokeArgsArgs };

export function getRevokeInstructionDataEncoder(): Encoder<RevokeInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder([
      ['discriminator', getU8Encoder()],
      ['revokeArgs', getRevokeArgsEncoder()],
    ]),
    (value) => ({ ...value, discriminator: 49 })
  );
}

export function getRevokeInstructionDataDecoder(): Decoder<RevokeInstructionData> {
  return getStructDecoder([
    ['discriminator', getU8Decoder()],
    ['revokeArgs', getRevokeArgsDecoder()],
  ]);
}

export function getRevokeInstructionDataCodec(): Codec<
  RevokeInstructionDataArgs,
  RevokeInstructionData
> {
  return combineCodec(
    getRevokeInstructionDataEncoder(),
    getRevokeInstructionDataDecoder()
  );
}

export type RevokeInput<
  TAccountDelegateRecord extends string,
  TAccountDelegate extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountToken extends string,
  TAccountAuthority extends string,
  TAccountPayer extends string,
  TAccountSystemProgram extends string,
  TAccountSysvarInstructions extends string,
  TAccountSplTokenProgram extends string,
  TAccountAuthorizationRulesProgram extends string,
  TAccountAuthorizationRules extends string
> = {
  /** Delegate account key (pda of [mint id, delegate role, user id, authority id]) */
  delegateRecord: Address<TAccountDelegateRecord>;
  /** Owner of the delegated account */
  delegate: Address<TAccountDelegate>;
  /** Metadata account */
  metadata: Address<TAccountMetadata>;
  /** Master Edition account */
  masterEdition?: Address<TAccountMasterEdition>;
  /** Mint of metadata */
  mint: Address<TAccountMint>;
  /** Owned Token Account of mint */
  token?: Address<TAccountToken>;
  /** Authority to approve the delegation */
  authority: Address<TAccountAuthority>;
  /** Payer */
  payer: Address<TAccountPayer>;
  /** System Program */
  systemProgram?: Address<TAccountSystemProgram>;
  /** Instructions sysvar account */
  sysvarInstructions?: Address<TAccountSysvarInstructions>;
  /** SPL Token Program */
  splTokenProgram?: Address<TAccountSplTokenProgram>;
  /** Token Authorization Rules Program */
  authorizationRulesProgram?: Address<TAccountAuthorizationRulesProgram>;
  /** Token Authorization Rules account */
  authorizationRules?: Address<TAccountAuthorizationRules>;
  revokeArgs: RevokeInstructionDataArgs['revokeArgs'];
};

export type RevokeInputWithSigners<
  TAccountDelegateRecord extends string,
  TAccountDelegate extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountToken extends string,
  TAccountAuthority extends string,
  TAccountPayer extends string,
  TAccountSystemProgram extends string,
  TAccountSysvarInstructions extends string,
  TAccountSplTokenProgram extends string,
  TAccountAuthorizationRulesProgram extends string,
  TAccountAuthorizationRules extends string
> = {
  /** Delegate account key (pda of [mint id, delegate role, user id, authority id]) */
  delegateRecord: Address<TAccountDelegateRecord>;
  /** Owner of the delegated account */
  delegate: Address<TAccountDelegate>;
  /** Metadata account */
  metadata: Address<TAccountMetadata>;
  /** Master Edition account */
  masterEdition?: Address<TAccountMasterEdition>;
  /** Mint of metadata */
  mint: Address<TAccountMint>;
  /** Owned Token Account of mint */
  token?: Address<TAccountToken>;
  /** Authority to approve the delegation */
  authority: TransactionSigner<TAccountAuthority>;
  /** Payer */
  payer: TransactionSigner<TAccountPayer>;
  /** System Program */
  systemProgram?: Address<TAccountSystemProgram>;
  /** Instructions sysvar account */
  sysvarInstructions?: Address<TAccountSysvarInstructions>;
  /** SPL Token Program */
  splTokenProgram?: Address<TAccountSplTokenProgram>;
  /** Token Authorization Rules Program */
  authorizationRulesProgram?: Address<TAccountAuthorizationRulesProgram>;
  /** Token Authorization Rules account */
  authorizationRules?: Address<TAccountAuthorizationRules>;
  revokeArgs: RevokeInstructionDataArgs['revokeArgs'];
};

export function getRevokeInstruction<
  TAccountDelegateRecord extends string,
  TAccountDelegate extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountToken extends string,
  TAccountAuthority extends string,
  TAccountPayer extends string,
  TAccountSystemProgram extends string,
  TAccountSysvarInstructions extends string,
  TAccountSplTokenProgram extends string,
  TAccountAuthorizationRulesProgram extends string,
  TAccountAuthorizationRules extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  input: RevokeInputWithSigners<
    TAccountDelegateRecord,
    TAccountDelegate,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountMint,
    TAccountToken,
    TAccountAuthority,
    TAccountPayer,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountSplTokenProgram,
    TAccountAuthorizationRulesProgram,
    TAccountAuthorizationRules
  >
): RevokeInstructionWithSigners<
  TProgram,
  TAccountDelegateRecord,
  TAccountDelegate,
  TAccountMetadata,
  TAccountMasterEdition,
  TAccountMint,
  TAccountToken,
  TAccountAuthority,
  TAccountPayer,
  TAccountSystemProgram,
  TAccountSysvarInstructions,
  TAccountSplTokenProgram,
  TAccountAuthorizationRulesProgram,
  TAccountAuthorizationRules
>;
export function getRevokeInstruction<
  TAccountDelegateRecord extends string,
  TAccountDelegate extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountToken extends string,
  TAccountAuthority extends string,
  TAccountPayer extends string,
  TAccountSystemProgram extends string,
  TAccountSysvarInstructions extends string,
  TAccountSplTokenProgram extends string,
  TAccountAuthorizationRulesProgram extends string,
  TAccountAuthorizationRules extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  input: RevokeInput<
    TAccountDelegateRecord,
    TAccountDelegate,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountMint,
    TAccountToken,
    TAccountAuthority,
    TAccountPayer,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountSplTokenProgram,
    TAccountAuthorizationRulesProgram,
    TAccountAuthorizationRules
  >
): RevokeInstruction<
  TProgram,
  TAccountDelegateRecord,
  TAccountDelegate,
  TAccountMetadata,
  TAccountMasterEdition,
  TAccountMint,
  TAccountToken,
  TAccountAuthority,
  TAccountPayer,
  TAccountSystemProgram,
  TAccountSysvarInstructions,
  TAccountSplTokenProgram,
  TAccountAuthorizationRulesProgram,
  TAccountAuthorizationRules
>;
export function getRevokeInstruction<
  TAccountDelegateRecord extends string,
  TAccountDelegate extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountToken extends string,
  TAccountAuthority extends string,
  TAccountPayer extends string,
  TAccountSystemProgram extends string,
  TAccountSysvarInstructions extends string,
  TAccountSplTokenProgram extends string,
  TAccountAuthorizationRulesProgram extends string,
  TAccountAuthorizationRules extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  input: RevokeInput<
    TAccountDelegateRecord,
    TAccountDelegate,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountMint,
    TAccountToken,
    TAccountAuthority,
    TAccountPayer,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountSplTokenProgram,
    TAccountAuthorizationRulesProgram,
    TAccountAuthorizationRules
  >
): IInstruction {
  // Program address.
  const programAddress =
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>;

  // Original accounts.
  type AccountMetas = Parameters<
    typeof getRevokeInstructionRaw<
      TProgram,
      TAccountDelegateRecord,
      TAccountDelegate,
      TAccountMetadata,
      TAccountMasterEdition,
      TAccountMint,
      TAccountToken,
      TAccountAuthority,
      TAccountPayer,
      TAccountSystemProgram,
      TAccountSysvarInstructions,
      TAccountSplTokenProgram,
      TAccountAuthorizationRulesProgram,
      TAccountAuthorizationRules
    >
  >[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    delegateRecord: { value: input.delegateRecord ?? null, isWritable: true },
    delegate: { value: input.delegate ?? null, isWritable: false },
    metadata: { value: input.metadata ?? null, isWritable: true },
    masterEdition: { value: input.masterEdition ?? null, isWritable: false },
    mint: { value: input.mint ?? null, isWritable: false },
    token: { value: input.token ?? null, isWritable: true },
    authority: { value: input.authority ?? null, isWritable: false },
    payer: { value: input.payer ?? null, isWritable: true },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
    sysvarInstructions: {
      value: input.sysvarInstructions ?? null,
      isWritable: false,
    },
    splTokenProgram: {
      value: input.splTokenProgram ?? null,
      isWritable: false,
    },
    authorizationRulesProgram: {
      value: input.authorizationRulesProgram ?? null,
      isWritable: false,
    },
    authorizationRules: {
      value: input.authorizationRules ?? null,
      isWritable: false,
    },
  };

  // Original args.
  const args = { ...input };

  // Resolve default values.
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value =
      '11111111111111111111111111111111' as Address<'11111111111111111111111111111111'>;
  }
  if (!accounts.sysvarInstructions.value) {
    accounts.sysvarInstructions.value =
      'Sysvar1nstructions1111111111111111111111111' as Address<'Sysvar1nstructions1111111111111111111111111'>;
  }

  // Get account metas and signers.
  const accountMetas = getAccountMetasWithSigners(
    accounts,
    'programId',
    programAddress
  );

  const instruction = getRevokeInstructionRaw(
    accountMetas as Record<keyof AccountMetas, IAccountMeta>,
    args as RevokeInstructionDataArgs,
    programAddress
  );

  return instruction;
}

export function getRevokeInstructionRaw<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountDelegateRecord extends string | IAccountMeta<string> = string,
  TAccountDelegate extends string | IAccountMeta<string> = string,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountMasterEdition extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountToken extends string | IAccountMeta<string> = string,
  TAccountAuthority extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountSysvarInstructions extends
    | string
    | IAccountMeta<string> = 'Sysvar1nstructions1111111111111111111111111',
  TAccountSplTokenProgram extends string | IAccountMeta<string> = string,
  TAccountAuthorizationRulesProgram extends
    | string
    | IAccountMeta<string> = string,
  TAccountAuthorizationRules extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
>(
  accounts: {
    delegateRecord: TAccountDelegateRecord extends string
      ? Address<TAccountDelegateRecord>
      : TAccountDelegateRecord;
    delegate: TAccountDelegate extends string
      ? Address<TAccountDelegate>
      : TAccountDelegate;
    metadata: TAccountMetadata extends string
      ? Address<TAccountMetadata>
      : TAccountMetadata;
    masterEdition?: TAccountMasterEdition extends string
      ? Address<TAccountMasterEdition>
      : TAccountMasterEdition;
    mint: TAccountMint extends string ? Address<TAccountMint> : TAccountMint;
    token?: TAccountToken extends string
      ? Address<TAccountToken>
      : TAccountToken;
    authority: TAccountAuthority extends string
      ? Address<TAccountAuthority>
      : TAccountAuthority;
    payer: TAccountPayer extends string
      ? Address<TAccountPayer>
      : TAccountPayer;
    systemProgram?: TAccountSystemProgram extends string
      ? Address<TAccountSystemProgram>
      : TAccountSystemProgram;
    sysvarInstructions?: TAccountSysvarInstructions extends string
      ? Address<TAccountSysvarInstructions>
      : TAccountSysvarInstructions;
    splTokenProgram?: TAccountSplTokenProgram extends string
      ? Address<TAccountSplTokenProgram>
      : TAccountSplTokenProgram;
    authorizationRulesProgram?: TAccountAuthorizationRulesProgram extends string
      ? Address<TAccountAuthorizationRulesProgram>
      : TAccountAuthorizationRulesProgram;
    authorizationRules?: TAccountAuthorizationRules extends string
      ? Address<TAccountAuthorizationRules>
      : TAccountAuthorizationRules;
  },
  args: RevokeInstructionDataArgs,
  programAddress: Address<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<TProgram>,
  remainingAccounts?: TRemainingAccounts
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.delegateRecord, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.delegate, AccountRole.READONLY),
      accountMetaWithDefault(accounts.metadata, AccountRole.WRITABLE),
      accountMetaWithDefault(
        accounts.masterEdition ?? {
          address:
            'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
      accountMetaWithDefault(accounts.mint, AccountRole.READONLY),
      accountMetaWithDefault(
        accounts.token ?? {
          address:
            'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>,
          role: AccountRole.READONLY,
        },
        AccountRole.WRITABLE
      ),
      accountMetaWithDefault(accounts.authority, AccountRole.READONLY_SIGNER),
      accountMetaWithDefault(accounts.payer, AccountRole.WRITABLE_SIGNER),
      accountMetaWithDefault(
        accounts.systemProgram ??
          ('11111111111111111111111111111111' as Address<'11111111111111111111111111111111'>),
        AccountRole.READONLY
      ),
      accountMetaWithDefault(
        accounts.sysvarInstructions ??
          ('Sysvar1nstructions1111111111111111111111111' as Address<'Sysvar1nstructions1111111111111111111111111'>),
        AccountRole.READONLY
      ),
      accountMetaWithDefault(
        accounts.splTokenProgram ?? {
          address:
            'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
      accountMetaWithDefault(
        accounts.authorizationRulesProgram ?? {
          address:
            'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
      accountMetaWithDefault(
        accounts.authorizationRules ?? {
          address:
            'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
      ...(remainingAccounts ?? []),
    ],
    data: getRevokeInstructionDataEncoder().encode(args),
    programAddress,
  } as RevokeInstruction<
    TProgram,
    TAccountDelegateRecord,
    TAccountDelegate,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountMint,
    TAccountToken,
    TAccountAuthority,
    TAccountPayer,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountSplTokenProgram,
    TAccountAuthorizationRulesProgram,
    TAccountAuthorizationRules,
    TRemainingAccounts
  >;
}

export type ParsedRevokeInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountMetas extends readonly IAccountMeta[] = readonly IAccountMeta[]
> = {
  programAddress: Address<TProgram>;
  accounts: {
    /** Delegate account key (pda of [mint id, delegate role, user id, authority id]) */
    delegateRecord: TAccountMetas[0];
    /** Owner of the delegated account */
    delegate: TAccountMetas[1];
    /** Metadata account */
    metadata: TAccountMetas[2];
    /** Master Edition account */
    masterEdition?: TAccountMetas[3] | undefined;
    /** Mint of metadata */
    mint: TAccountMetas[4];
    /** Owned Token Account of mint */
    token?: TAccountMetas[5] | undefined;
    /** Authority to approve the delegation */
    authority: TAccountMetas[6];
    /** Payer */
    payer: TAccountMetas[7];
    /** System Program */
    systemProgram: TAccountMetas[8];
    /** Instructions sysvar account */
    sysvarInstructions: TAccountMetas[9];
    /** SPL Token Program */
    splTokenProgram?: TAccountMetas[10] | undefined;
    /** Token Authorization Rules Program */
    authorizationRulesProgram?: TAccountMetas[11] | undefined;
    /** Token Authorization Rules account */
    authorizationRules?: TAccountMetas[12] | undefined;
  };
  data: RevokeInstructionData;
};

export function parseRevokeInstruction<
  TProgram extends string,
  TAccountMetas extends readonly IAccountMeta[]
>(
  instruction: IInstruction<TProgram> &
    IInstructionWithAccounts<TAccountMetas> &
    IInstructionWithData<Uint8Array>
): ParsedRevokeInstruction<TProgram, TAccountMetas> {
  if (instruction.accounts.length < 13) {
    // TODO: Coded error.
    throw new Error('Not enough accounts');
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts![accountIndex]!;
    accountIndex += 1;
    return accountMeta;
  };
  const getNextOptionalAccount = () => {
    const accountMeta = getNextAccount();
    return accountMeta.address === 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
      ? undefined
      : accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      delegateRecord: getNextAccount(),
      delegate: getNextAccount(),
      metadata: getNextAccount(),
      masterEdition: getNextOptionalAccount(),
      mint: getNextAccount(),
      token: getNextOptionalAccount(),
      authority: getNextAccount(),
      payer: getNextAccount(),
      systemProgram: getNextAccount(),
      sysvarInstructions: getNextAccount(),
      splTokenProgram: getNextOptionalAccount(),
      authorizationRulesProgram: getNextOptionalAccount(),
      authorizationRules: getNextOptionalAccount(),
    },
    data: getRevokeInstructionDataDecoder().decode(instruction.data),
  };
}
