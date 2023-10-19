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
import {
  MintNewEditionFromMasterEditionViaTokenArgs,
  MintNewEditionFromMasterEditionViaTokenArgsArgs,
  getMintNewEditionFromMasterEditionViaTokenArgsDecoder,
  getMintNewEditionFromMasterEditionViaTokenArgsEncoder,
} from '../types';

// Output.
export type MintNewEditionFromMasterEditionViaVaultProxyInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountNewMetadata extends string | IAccountMeta<string> = string,
  TAccountNewEdition extends string | IAccountMeta<string> = string,
  TAccountMasterEdition extends string | IAccountMeta<string> = string,
  TAccountNewMint extends string | IAccountMeta<string> = string,
  TAccountEditionMarkPda extends string | IAccountMeta<string> = string,
  TAccountNewMintAuthority extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountVaultAuthority extends string | IAccountMeta<string> = string,
  TAccountSafetyDepositStore extends string | IAccountMeta<string> = string,
  TAccountSafetyDepositBox extends string | IAccountMeta<string> = string,
  TAccountVault extends string | IAccountMeta<string> = string,
  TAccountNewMetadataUpdateAuthority extends
    | string
    | IAccountMeta<string> = string,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountTokenProgram extends
    | string
    | IAccountMeta<string> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountTokenVaultProgram extends string | IAccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountRent extends string | IAccountMeta<string> = string
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountNewMetadata extends string
        ? WritableAccount<TAccountNewMetadata>
        : TAccountNewMetadata,
      TAccountNewEdition extends string
        ? WritableAccount<TAccountNewEdition>
        : TAccountNewEdition,
      TAccountMasterEdition extends string
        ? WritableAccount<TAccountMasterEdition>
        : TAccountMasterEdition,
      TAccountNewMint extends string
        ? WritableAccount<TAccountNewMint>
        : TAccountNewMint,
      TAccountEditionMarkPda extends string
        ? WritableAccount<TAccountEditionMarkPda>
        : TAccountEditionMarkPda,
      TAccountNewMintAuthority extends string
        ? ReadonlySignerAccount<TAccountNewMintAuthority>
        : TAccountNewMintAuthority,
      TAccountPayer extends string
        ? WritableSignerAccount<TAccountPayer>
        : TAccountPayer,
      TAccountVaultAuthority extends string
        ? ReadonlySignerAccount<TAccountVaultAuthority>
        : TAccountVaultAuthority,
      TAccountSafetyDepositStore extends string
        ? ReadonlyAccount<TAccountSafetyDepositStore>
        : TAccountSafetyDepositStore,
      TAccountSafetyDepositBox extends string
        ? ReadonlyAccount<TAccountSafetyDepositBox>
        : TAccountSafetyDepositBox,
      TAccountVault extends string
        ? ReadonlyAccount<TAccountVault>
        : TAccountVault,
      TAccountNewMetadataUpdateAuthority extends string
        ? ReadonlyAccount<TAccountNewMetadataUpdateAuthority>
        : TAccountNewMetadataUpdateAuthority,
      TAccountMetadata extends string
        ? ReadonlyAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountTokenProgram extends string
        ? ReadonlyAccount<TAccountTokenProgram>
        : TAccountTokenProgram,
      TAccountTokenVaultProgram extends string
        ? ReadonlyAccount<TAccountTokenVaultProgram>
        : TAccountTokenVaultProgram,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      TAccountRent extends string ? ReadonlyAccount<TAccountRent> : TAccountRent
    ]
  >;

export type MintNewEditionFromMasterEditionViaVaultProxyInstructionData = {
  discriminator: number;
  mintNewEditionFromMasterEditionViaTokenArgs: MintNewEditionFromMasterEditionViaTokenArgs;
};

export type MintNewEditionFromMasterEditionViaVaultProxyInstructionDataArgs = {
  mintNewEditionFromMasterEditionViaTokenArgs: MintNewEditionFromMasterEditionViaTokenArgsArgs;
};

export function getMintNewEditionFromMasterEditionViaVaultProxyInstructionDataEncoder(): Encoder<MintNewEditionFromMasterEditionViaVaultProxyInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder<MintNewEditionFromMasterEditionViaVaultProxyInstructionData>(
      [
        ['discriminator', getU8Encoder()],
        [
          'mintNewEditionFromMasterEditionViaTokenArgs',
          getMintNewEditionFromMasterEditionViaTokenArgsEncoder(),
        ],
      ],
      {
        description:
          'MintNewEditionFromMasterEditionViaVaultProxyInstructionData',
      }
    ),
    (value) =>
      ({
        ...value,
        discriminator: 13,
      } as MintNewEditionFromMasterEditionViaVaultProxyInstructionData)
  ) as Encoder<MintNewEditionFromMasterEditionViaVaultProxyInstructionDataArgs>;
}

export function getMintNewEditionFromMasterEditionViaVaultProxyInstructionDataDecoder(): Decoder<MintNewEditionFromMasterEditionViaVaultProxyInstructionData> {
  return getStructDecoder<MintNewEditionFromMasterEditionViaVaultProxyInstructionData>(
    [
      ['discriminator', getU8Decoder()],
      [
        'mintNewEditionFromMasterEditionViaTokenArgs',
        getMintNewEditionFromMasterEditionViaTokenArgsDecoder(),
      ],
    ],
    {
      description:
        'MintNewEditionFromMasterEditionViaVaultProxyInstructionData',
    }
  ) as Decoder<MintNewEditionFromMasterEditionViaVaultProxyInstructionData>;
}

export function getMintNewEditionFromMasterEditionViaVaultProxyInstructionDataCodec(): Codec<
  MintNewEditionFromMasterEditionViaVaultProxyInstructionDataArgs,
  MintNewEditionFromMasterEditionViaVaultProxyInstructionData
> {
  return combineCodec(
    getMintNewEditionFromMasterEditionViaVaultProxyInstructionDataEncoder(),
    getMintNewEditionFromMasterEditionViaVaultProxyInstructionDataDecoder()
  );
}

export function mintNewEditionFromMasterEditionViaVaultProxyInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountNewMetadata extends string | IAccountMeta<string> = string,
  TAccountNewEdition extends string | IAccountMeta<string> = string,
  TAccountMasterEdition extends string | IAccountMeta<string> = string,
  TAccountNewMint extends string | IAccountMeta<string> = string,
  TAccountEditionMarkPda extends string | IAccountMeta<string> = string,
  TAccountNewMintAuthority extends string | IAccountMeta<string> = string,
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountVaultAuthority extends string | IAccountMeta<string> = string,
  TAccountSafetyDepositStore extends string | IAccountMeta<string> = string,
  TAccountSafetyDepositBox extends string | IAccountMeta<string> = string,
  TAccountVault extends string | IAccountMeta<string> = string,
  TAccountNewMetadataUpdateAuthority extends
    | string
    | IAccountMeta<string> = string,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountTokenProgram extends
    | string
    | IAccountMeta<string> = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TAccountTokenVaultProgram extends string | IAccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountRent extends string | IAccountMeta<string> = string
>(
  accounts: {
    newMetadata: TAccountNewMetadata extends string
      ? Base58EncodedAddress<TAccountNewMetadata>
      : TAccountNewMetadata;
    newEdition: TAccountNewEdition extends string
      ? Base58EncodedAddress<TAccountNewEdition>
      : TAccountNewEdition;
    masterEdition: TAccountMasterEdition extends string
      ? Base58EncodedAddress<TAccountMasterEdition>
      : TAccountMasterEdition;
    newMint: TAccountNewMint extends string
      ? Base58EncodedAddress<TAccountNewMint>
      : TAccountNewMint;
    editionMarkPda: TAccountEditionMarkPda extends string
      ? Base58EncodedAddress<TAccountEditionMarkPda>
      : TAccountEditionMarkPda;
    newMintAuthority: TAccountNewMintAuthority extends string
      ? Base58EncodedAddress<TAccountNewMintAuthority>
      : TAccountNewMintAuthority;
    payer: TAccountPayer extends string
      ? Base58EncodedAddress<TAccountPayer>
      : TAccountPayer;
    vaultAuthority: TAccountVaultAuthority extends string
      ? Base58EncodedAddress<TAccountVaultAuthority>
      : TAccountVaultAuthority;
    safetyDepositStore: TAccountSafetyDepositStore extends string
      ? Base58EncodedAddress<TAccountSafetyDepositStore>
      : TAccountSafetyDepositStore;
    safetyDepositBox: TAccountSafetyDepositBox extends string
      ? Base58EncodedAddress<TAccountSafetyDepositBox>
      : TAccountSafetyDepositBox;
    vault: TAccountVault extends string
      ? Base58EncodedAddress<TAccountVault>
      : TAccountVault;
    newMetadataUpdateAuthority: TAccountNewMetadataUpdateAuthority extends string
      ? Base58EncodedAddress<TAccountNewMetadataUpdateAuthority>
      : TAccountNewMetadataUpdateAuthority;
    metadata: TAccountMetadata extends string
      ? Base58EncodedAddress<TAccountMetadata>
      : TAccountMetadata;
    tokenProgram?: TAccountTokenProgram extends string
      ? Base58EncodedAddress<TAccountTokenProgram>
      : TAccountTokenProgram;
    tokenVaultProgram: TAccountTokenVaultProgram extends string
      ? Base58EncodedAddress<TAccountTokenVaultProgram>
      : TAccountTokenVaultProgram;
    systemProgram?: TAccountSystemProgram extends string
      ? Base58EncodedAddress<TAccountSystemProgram>
      : TAccountSystemProgram;
    rent?: TAccountRent extends string
      ? Base58EncodedAddress<TAccountRent>
      : TAccountRent;
  },
  args: MintNewEditionFromMasterEditionViaVaultProxyInstructionDataArgs,
  programAddress: Base58EncodedAddress<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Base58EncodedAddress<TProgram>
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.newMetadata, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.newEdition, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.masterEdition, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.newMint, AccountRole.WRITABLE),
      accountMetaWithDefault(accounts.editionMarkPda, AccountRole.WRITABLE),
      accountMetaWithDefault(
        accounts.newMintAuthority,
        AccountRole.READONLY_SIGNER
      ),
      accountMetaWithDefault(accounts.payer, AccountRole.WRITABLE_SIGNER),
      accountMetaWithDefault(
        accounts.vaultAuthority,
        AccountRole.READONLY_SIGNER
      ),
      accountMetaWithDefault(accounts.safetyDepositStore, AccountRole.READONLY),
      accountMetaWithDefault(accounts.safetyDepositBox, AccountRole.READONLY),
      accountMetaWithDefault(accounts.vault, AccountRole.READONLY),
      accountMetaWithDefault(
        accounts.newMetadataUpdateAuthority,
        AccountRole.READONLY
      ),
      accountMetaWithDefault(accounts.metadata, AccountRole.READONLY),
      accountMetaWithDefault(
        accounts.tokenProgram ?? {
          address:
            'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Base58EncodedAddress<'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
      accountMetaWithDefault(accounts.tokenVaultProgram, AccountRole.READONLY),
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
    data: getMintNewEditionFromMasterEditionViaVaultProxyInstructionDataEncoder().encode(
      args
    ),
    programAddress,
  } as MintNewEditionFromMasterEditionViaVaultProxyInstruction<
    TProgram,
    TAccountNewMetadata,
    TAccountNewEdition,
    TAccountMasterEdition,
    TAccountNewMint,
    TAccountEditionMarkPda,
    TAccountNewMintAuthority,
    TAccountPayer,
    TAccountVaultAuthority,
    TAccountSafetyDepositStore,
    TAccountSafetyDepositBox,
    TAccountVault,
    TAccountNewMetadataUpdateAuthority,
    TAccountMetadata,
    TAccountTokenProgram,
    TAccountTokenVaultProgram,
    TAccountSystemProgram,
    TAccountRent
  >;
}

// Input.
export type MintNewEditionFromMasterEditionViaVaultProxyInput<
  TAccountNewMetadata extends string,
  TAccountNewEdition extends string,
  TAccountMasterEdition extends string,
  TAccountNewMint extends string,
  TAccountEditionMarkPda extends string,
  TAccountNewMintAuthority extends string,
  TAccountPayer extends string,
  TAccountVaultAuthority extends string,
  TAccountSafetyDepositStore extends string,
  TAccountSafetyDepositBox extends string,
  TAccountVault extends string,
  TAccountNewMetadataUpdateAuthority extends string,
  TAccountMetadata extends string,
  TAccountTokenProgram extends string,
  TAccountTokenVaultProgram extends string,
  TAccountSystemProgram extends string,
  TAccountRent extends string
> = {
  /** New Metadata key (pda of ['metadata', program id, mint id]) */
  newMetadata: Base58EncodedAddress<TAccountNewMetadata>;
  /** New Edition (pda of ['metadata', program id, mint id, 'edition']) */
  newEdition: Base58EncodedAddress<TAccountNewEdition>;
  /** Master Record Edition V2 (pda of ['metadata', program id, master metadata mint id, 'edition'] */
  masterEdition: Base58EncodedAddress<TAccountMasterEdition>;
  /** Mint of new token - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY */
  newMint: Base58EncodedAddress<TAccountNewMint>;
  /** Edition pda to mark creation - will be checked for pre-existence. (pda of ['metadata', program id, master metadata mint id, 'edition', edition_number]) where edition_number is NOT the edition number you pass in args but actually edition_number = floor(edition/EDITION_MARKER_BIT_SIZE). */
  editionMarkPda: Base58EncodedAddress<TAccountEditionMarkPda>;
  /** Mint authority of new mint */
  newMintAuthority: Signer<TAccountNewMintAuthority>;
  /** payer */
  payer?: Signer<TAccountPayer>;
  /** Vault authority */
  vaultAuthority: Signer<TAccountVaultAuthority>;
  /** Safety deposit token store account */
  safetyDepositStore: Base58EncodedAddress<TAccountSafetyDepositStore>;
  /** Safety deposit box */
  safetyDepositBox: Base58EncodedAddress<TAccountSafetyDepositBox>;
  /** Vault */
  vault: Base58EncodedAddress<TAccountVault>;
  /** Update authority info for new metadata */
  newMetadataUpdateAuthority: Base58EncodedAddress<TAccountNewMetadataUpdateAuthority>;
  /** Master record metadata account */
  metadata: Base58EncodedAddress<TAccountMetadata>;
  /** Token program */
  tokenProgram?: Base58EncodedAddress<TAccountTokenProgram>;
  /** Token vault program */
  tokenVaultProgram: Base58EncodedAddress<TAccountTokenVaultProgram>;
  /** System program */
  systemProgram?: Base58EncodedAddress<TAccountSystemProgram>;
  /** Rent info */
  rent?: Base58EncodedAddress<TAccountRent>;
  mintNewEditionFromMasterEditionViaTokenArgs: MintNewEditionFromMasterEditionViaVaultProxyInstructionDataArgs['mintNewEditionFromMasterEditionViaTokenArgs'];
};

export async function mintNewEditionFromMasterEditionViaVaultProxy<
  TReturn,
  TAccountNewMetadata extends string,
  TAccountNewEdition extends string,
  TAccountMasterEdition extends string,
  TAccountNewMint extends string,
  TAccountEditionMarkPda extends string,
  TAccountNewMintAuthority extends string,
  TAccountPayer extends string,
  TAccountVaultAuthority extends string,
  TAccountSafetyDepositStore extends string,
  TAccountSafetyDepositBox extends string,
  TAccountVault extends string,
  TAccountNewMetadataUpdateAuthority extends string,
  TAccountMetadata extends string,
  TAccountTokenProgram extends string,
  TAccountTokenVaultProgram extends string,
  TAccountSystemProgram extends string,
  TAccountRent extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  context: Pick<Context, 'getProgramAddress'> &
    CustomGeneratedInstruction<
      MintNewEditionFromMasterEditionViaVaultProxyInstruction<
        TProgram,
        TAccountNewMetadata,
        TAccountNewEdition,
        TAccountMasterEdition,
        TAccountNewMint,
        TAccountEditionMarkPda,
        TAccountNewMintAuthority,
        TAccountPayer,
        TAccountVaultAuthority,
        TAccountSafetyDepositStore,
        TAccountSafetyDepositBox,
        TAccountVault,
        TAccountNewMetadataUpdateAuthority,
        TAccountMetadata,
        TAccountTokenProgram,
        TAccountTokenVaultProgram,
        TAccountSystemProgram,
        TAccountRent
      >,
      TReturn
    >,
  input: MintNewEditionFromMasterEditionViaVaultProxyInput<
    TAccountNewMetadata,
    TAccountNewEdition,
    TAccountMasterEdition,
    TAccountNewMint,
    TAccountEditionMarkPda,
    TAccountNewMintAuthority,
    TAccountPayer,
    TAccountVaultAuthority,
    TAccountSafetyDepositStore,
    TAccountSafetyDepositBox,
    TAccountVault,
    TAccountNewMetadataUpdateAuthority,
    TAccountMetadata,
    TAccountTokenProgram,
    TAccountTokenVaultProgram,
    TAccountSystemProgram,
    TAccountRent
  >
): Promise<TReturn>;
export async function mintNewEditionFromMasterEditionViaVaultProxy<
  TAccountNewMetadata extends string,
  TAccountNewEdition extends string,
  TAccountMasterEdition extends string,
  TAccountNewMint extends string,
  TAccountEditionMarkPda extends string,
  TAccountNewMintAuthority extends string,
  TAccountPayer extends string,
  TAccountVaultAuthority extends string,
  TAccountSafetyDepositStore extends string,
  TAccountSafetyDepositBox extends string,
  TAccountVault extends string,
  TAccountNewMetadataUpdateAuthority extends string,
  TAccountMetadata extends string,
  TAccountTokenProgram extends string,
  TAccountTokenVaultProgram extends string,
  TAccountSystemProgram extends string,
  TAccountRent extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: MintNewEditionFromMasterEditionViaVaultProxyInput<
    TAccountNewMetadata,
    TAccountNewEdition,
    TAccountMasterEdition,
    TAccountNewMint,
    TAccountEditionMarkPda,
    TAccountNewMintAuthority,
    TAccountPayer,
    TAccountVaultAuthority,
    TAccountSafetyDepositStore,
    TAccountSafetyDepositBox,
    TAccountVault,
    TAccountNewMetadataUpdateAuthority,
    TAccountMetadata,
    TAccountTokenProgram,
    TAccountTokenVaultProgram,
    TAccountSystemProgram,
    TAccountRent
  >
): Promise<
  WrappedInstruction<
    MintNewEditionFromMasterEditionViaVaultProxyInstruction<
      TProgram,
      TAccountNewMetadata,
      TAccountNewEdition,
      TAccountMasterEdition,
      TAccountNewMint,
      TAccountEditionMarkPda,
      TAccountNewMintAuthority,
      TAccountPayer,
      TAccountVaultAuthority,
      TAccountSafetyDepositStore,
      TAccountSafetyDepositBox,
      TAccountVault,
      TAccountNewMetadataUpdateAuthority,
      TAccountMetadata,
      TAccountTokenProgram,
      TAccountTokenVaultProgram,
      TAccountSystemProgram,
      TAccountRent
    >
  >
>;
export async function mintNewEditionFromMasterEditionViaVaultProxy<
  TAccountNewMetadata extends string,
  TAccountNewEdition extends string,
  TAccountMasterEdition extends string,
  TAccountNewMint extends string,
  TAccountEditionMarkPda extends string,
  TAccountNewMintAuthority extends string,
  TAccountPayer extends string,
  TAccountVaultAuthority extends string,
  TAccountSafetyDepositStore extends string,
  TAccountSafetyDepositBox extends string,
  TAccountVault extends string,
  TAccountNewMetadataUpdateAuthority extends string,
  TAccountMetadata extends string,
  TAccountTokenProgram extends string,
  TAccountTokenVaultProgram extends string,
  TAccountSystemProgram extends string,
  TAccountRent extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  input: MintNewEditionFromMasterEditionViaVaultProxyInput<
    TAccountNewMetadata,
    TAccountNewEdition,
    TAccountMasterEdition,
    TAccountNewMint,
    TAccountEditionMarkPda,
    TAccountNewMintAuthority,
    TAccountPayer,
    TAccountVaultAuthority,
    TAccountSafetyDepositStore,
    TAccountSafetyDepositBox,
    TAccountVault,
    TAccountNewMetadataUpdateAuthority,
    TAccountMetadata,
    TAccountTokenProgram,
    TAccountTokenVaultProgram,
    TAccountSystemProgram,
    TAccountRent
  >
): Promise<
  WrappedInstruction<
    MintNewEditionFromMasterEditionViaVaultProxyInstruction<
      TProgram,
      TAccountNewMetadata,
      TAccountNewEdition,
      TAccountMasterEdition,
      TAccountNewMint,
      TAccountEditionMarkPda,
      TAccountNewMintAuthority,
      TAccountPayer,
      TAccountVaultAuthority,
      TAccountSafetyDepositStore,
      TAccountSafetyDepositBox,
      TAccountVault,
      TAccountNewMetadataUpdateAuthority,
      TAccountMetadata,
      TAccountTokenProgram,
      TAccountTokenVaultProgram,
      TAccountSystemProgram,
      TAccountRent
    >
  >
>;
export async function mintNewEditionFromMasterEditionViaVaultProxy<
  TReturn,
  TAccountNewMetadata extends string,
  TAccountNewEdition extends string,
  TAccountMasterEdition extends string,
  TAccountNewMint extends string,
  TAccountEditionMarkPda extends string,
  TAccountNewMintAuthority extends string,
  TAccountPayer extends string,
  TAccountVaultAuthority extends string,
  TAccountSafetyDepositStore extends string,
  TAccountSafetyDepositBox extends string,
  TAccountVault extends string,
  TAccountNewMetadataUpdateAuthority extends string,
  TAccountMetadata extends string,
  TAccountTokenProgram extends string,
  TAccountTokenVaultProgram extends string,
  TAccountSystemProgram extends string,
  TAccountRent extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>)
    | MintNewEditionFromMasterEditionViaVaultProxyInput<
        TAccountNewMetadata,
        TAccountNewEdition,
        TAccountMasterEdition,
        TAccountNewMint,
        TAccountEditionMarkPda,
        TAccountNewMintAuthority,
        TAccountPayer,
        TAccountVaultAuthority,
        TAccountSafetyDepositStore,
        TAccountSafetyDepositBox,
        TAccountVault,
        TAccountNewMetadataUpdateAuthority,
        TAccountMetadata,
        TAccountTokenProgram,
        TAccountTokenVaultProgram,
        TAccountSystemProgram,
        TAccountRent
      >,
  rawInput?: MintNewEditionFromMasterEditionViaVaultProxyInput<
    TAccountNewMetadata,
    TAccountNewEdition,
    TAccountMasterEdition,
    TAccountNewMint,
    TAccountEditionMarkPda,
    TAccountNewMintAuthority,
    TAccountPayer,
    TAccountVaultAuthority,
    TAccountSafetyDepositStore,
    TAccountSafetyDepositBox,
    TAccountVault,
    TAccountNewMetadataUpdateAuthority,
    TAccountMetadata,
    TAccountTokenProgram,
    TAccountTokenVaultProgram,
    TAccountSystemProgram,
    TAccountRent
  >
): Promise<TReturn | WrappedInstruction<IInstruction>> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawInput) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as MintNewEditionFromMasterEditionViaVaultProxyInput<
    TAccountNewMetadata,
    TAccountNewEdition,
    TAccountMasterEdition,
    TAccountNewMint,
    TAccountEditionMarkPda,
    TAccountNewMintAuthority,
    TAccountPayer,
    TAccountVaultAuthority,
    TAccountSafetyDepositStore,
    TAccountSafetyDepositBox,
    TAccountVault,
    TAccountNewMetadataUpdateAuthority,
    TAccountMetadata,
    TAccountTokenProgram,
    TAccountTokenVaultProgram,
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
  type AccountMetas = Parameters<
    typeof mintNewEditionFromMasterEditionViaVaultProxyInstruction
  >[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    newMetadata: { value: input.newMetadata ?? null, isWritable: true },
    newEdition: { value: input.newEdition ?? null, isWritable: true },
    masterEdition: { value: input.masterEdition ?? null, isWritable: true },
    newMint: { value: input.newMint ?? null, isWritable: true },
    editionMarkPda: { value: input.editionMarkPda ?? null, isWritable: true },
    newMintAuthority: {
      value: input.newMintAuthority ?? null,
      isWritable: false,
    },
    payer: { value: input.payer ?? null, isWritable: true },
    vaultAuthority: { value: input.vaultAuthority ?? null, isWritable: false },
    safetyDepositStore: {
      value: input.safetyDepositStore ?? null,
      isWritable: false,
    },
    safetyDepositBox: {
      value: input.safetyDepositBox ?? null,
      isWritable: false,
    },
    vault: { value: input.vault ?? null, isWritable: false },
    newMetadataUpdateAuthority: {
      value: input.newMetadataUpdateAuthority ?? null,
      isWritable: false,
    },
    metadata: { value: input.metadata ?? null, isWritable: false },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false },
    tokenVaultProgram: {
      value: input.tokenVaultProgram ?? null,
      isWritable: false,
    },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
    rent: { value: input.rent ?? null, isWritable: false },
  };

  // Original args.
  const args = { ...input };

  // Resolve default values.
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value = await getProgramAddress(
      context,
      'splToken',
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    );
    accounts.tokenProgram.isWritable = false;
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = await getProgramAddress(
      context,
      'splSystem',
      '11111111111111111111111111111111'
    );
    accounts.systemProgram.isWritable = false;
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
    instruction: mintNewEditionFromMasterEditionViaVaultProxyInstruction(
      accountMetas as AccountMetas,
      args,
      programAddress
    ) as MintNewEditionFromMasterEditionViaVaultProxyInstruction<
      TProgram,
      TAccountNewMetadata,
      TAccountNewEdition,
      TAccountMasterEdition,
      TAccountNewMint,
      TAccountEditionMarkPda,
      TAccountNewMintAuthority,
      TAccountPayer,
      TAccountVaultAuthority,
      TAccountSafetyDepositStore,
      TAccountSafetyDepositBox,
      TAccountVault,
      TAccountNewMetadataUpdateAuthority,
      TAccountMetadata,
      TAccountTokenProgram,
      TAccountTokenVaultProgram,
      TAccountSystemProgram,
      TAccountRent
    >,
    signers,
    bytesCreatedOnChain: 0,
  };
}
