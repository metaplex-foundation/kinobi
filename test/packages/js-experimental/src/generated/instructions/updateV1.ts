/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Address,
  getAddressDecoder,
  getAddressEncoder,
} from '@solana/addresses';
import {
  Codec,
  Decoder,
  Encoder,
  combineCodec,
  mapEncoder,
} from '@solana/codecs-core';
import {
  getArrayDecoder,
  getArrayEncoder,
  getBooleanDecoder,
  getBooleanEncoder,
  getStructDecoder,
  getStructEncoder,
} from '@solana/codecs-data-structures';
import {
  getU16Decoder,
  getU16Encoder,
  getU8Decoder,
  getU8Encoder,
} from '@solana/codecs-numbers';
import { getStringDecoder, getStringEncoder } from '@solana/codecs-strings';
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
  Option,
  OptionOrNullable,
  getOptionDecoder,
  getOptionEncoder,
  some,
} from '@solana/options';
import {
  IAccountSignerMeta,
  IInstructionWithSigners,
  TransactionSigner,
} from '@solana/signers';
import {
  Context,
  CustomGeneratedInstruction,
  IInstructionWithBytesCreatedOnChain,
  ResolvedAccount,
  accountMetaWithDefault,
  getAccountMetasWithSigners,
  getProgramAddress,
} from '../shared';
import {
  AuthorityType,
  AuthorityTypeArgs,
  AuthorizationData,
  AuthorizationDataArgs,
  Collection,
  CollectionArgs,
  CollectionDetails,
  CollectionDetailsArgs,
  Creator,
  CreatorArgs,
  DelegateState,
  DelegateStateArgs,
  ProgrammableConfig,
  ProgrammableConfigArgs,
  TokenStandard,
  TokenStandardArgs,
  Uses,
  UsesArgs,
  getAuthorityTypeDecoder,
  getAuthorityTypeEncoder,
  getAuthorizationDataDecoder,
  getAuthorizationDataEncoder,
  getCollectionDecoder,
  getCollectionDetailsDecoder,
  getCollectionDetailsEncoder,
  getCollectionEncoder,
  getCreatorDecoder,
  getCreatorEncoder,
  getDelegateStateDecoder,
  getDelegateStateEncoder,
  getProgrammableConfigDecoder,
  getProgrammableConfigEncoder,
  getTokenStandardDecoder,
  getTokenStandardEncoder,
  getUsesDecoder,
  getUsesEncoder,
} from '../types';

// Output.
export type UpdateV1Instruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountAuthority extends string | IAccountMeta<string> = string,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountMasterEdition extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountSysvarInstructions extends
    | string
    | IAccountMeta<string> = 'Sysvar1nstructions1111111111111111111111111',
  TAccountToken extends string | IAccountMeta<string> = string,
  TAccountDelegateRecord extends string | IAccountMeta<string> = string,
  TAccountAuthorizationRulesProgram extends
    | string
    | IAccountMeta<string> = string,
  TAccountAuthorizationRules extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountAuthority extends string
        ? ReadonlySignerAccount<TAccountAuthority>
        : TAccountAuthority,
      TAccountMetadata extends string
        ? WritableAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountMasterEdition extends string
        ? WritableAccount<TAccountMasterEdition>
        : TAccountMasterEdition,
      TAccountMint extends string
        ? ReadonlyAccount<TAccountMint>
        : TAccountMint,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      TAccountSysvarInstructions extends string
        ? ReadonlyAccount<TAccountSysvarInstructions>
        : TAccountSysvarInstructions,
      TAccountToken extends string
        ? ReadonlyAccount<TAccountToken>
        : TAccountToken,
      TAccountDelegateRecord extends string
        ? ReadonlyAccount<TAccountDelegateRecord>
        : TAccountDelegateRecord,
      TAccountAuthorizationRulesProgram extends string
        ? ReadonlyAccount<TAccountAuthorizationRulesProgram>
        : TAccountAuthorizationRulesProgram,
      TAccountAuthorizationRules extends string
        ? ReadonlyAccount<TAccountAuthorizationRules>
        : TAccountAuthorizationRules,
      ...TRemainingAccounts
    ]
  >;

// Output.
export type UpdateV1InstructionWithSigners<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountAuthority extends string | IAccountMeta<string> = string,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountMasterEdition extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountSysvarInstructions extends
    | string
    | IAccountMeta<string> = 'Sysvar1nstructions1111111111111111111111111',
  TAccountToken extends string | IAccountMeta<string> = string,
  TAccountDelegateRecord extends string | IAccountMeta<string> = string,
  TAccountAuthorizationRulesProgram extends
    | string
    | IAccountMeta<string> = string,
  TAccountAuthorizationRules extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountAuthority extends string
        ? ReadonlySignerAccount<TAccountAuthority> &
            IAccountSignerMeta<TAccountAuthority>
        : TAccountAuthority,
      TAccountMetadata extends string
        ? WritableAccount<TAccountMetadata>
        : TAccountMetadata,
      TAccountMasterEdition extends string
        ? WritableAccount<TAccountMasterEdition>
        : TAccountMasterEdition,
      TAccountMint extends string
        ? ReadonlyAccount<TAccountMint>
        : TAccountMint,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      TAccountSysvarInstructions extends string
        ? ReadonlyAccount<TAccountSysvarInstructions>
        : TAccountSysvarInstructions,
      TAccountToken extends string
        ? ReadonlyAccount<TAccountToken>
        : TAccountToken,
      TAccountDelegateRecord extends string
        ? ReadonlyAccount<TAccountDelegateRecord>
        : TAccountDelegateRecord,
      TAccountAuthorizationRulesProgram extends string
        ? ReadonlyAccount<TAccountAuthorizationRulesProgram>
        : TAccountAuthorizationRulesProgram,
      TAccountAuthorizationRules extends string
        ? ReadonlyAccount<TAccountAuthorizationRules>
        : TAccountAuthorizationRules,
      ...TRemainingAccounts
    ]
  >;

export type UpdateV1InstructionData = {
  discriminator: number;
  updateV1Discriminator: number;
  authorizationData: Option<AuthorizationData>;
  newUpdateAuthority: Option<Address>;
  data: Option<{
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: Option<Array<Creator>>;
  }>;
  primarySaleHappened: Option<boolean>;
  isMutable: Option<boolean>;
  tokenStandard: Option<TokenStandard>;
  collection: Option<Collection>;
  uses: Option<Uses>;
  collectionDetails: Option<CollectionDetails>;
  programmableConfig: Option<ProgrammableConfig>;
  delegateState: Option<DelegateState>;
  authorityType: AuthorityType;
};

export type UpdateV1InstructionDataArgs = {
  authorizationData: OptionOrNullable<AuthorizationDataArgs>;
  newUpdateAuthority: OptionOrNullable<Address>;
  data: OptionOrNullable<{
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: OptionOrNullable<Array<CreatorArgs>>;
  }>;
  primarySaleHappened: OptionOrNullable<boolean>;
  isMutable: OptionOrNullable<boolean>;
  tokenStandard?: OptionOrNullable<TokenStandardArgs>;
  collection: OptionOrNullable<CollectionArgs>;
  uses: OptionOrNullable<UsesArgs>;
  collectionDetails: OptionOrNullable<CollectionDetailsArgs>;
  programmableConfig: OptionOrNullable<ProgrammableConfigArgs>;
  delegateState: OptionOrNullable<DelegateStateArgs>;
  authorityType: AuthorityTypeArgs;
};

export function getUpdateV1InstructionDataEncoder() {
  return mapEncoder(
    getStructEncoder<{
      discriminator: number;
      updateV1Discriminator: number;
      authorizationData: OptionOrNullable<AuthorizationDataArgs>;
      newUpdateAuthority: OptionOrNullable<Address>;
      data: OptionOrNullable<{
        name: string;
        symbol: string;
        uri: string;
        sellerFeeBasisPoints: number;
        creators: OptionOrNullable<Array<CreatorArgs>>;
      }>;
      primarySaleHappened: OptionOrNullable<boolean>;
      isMutable: OptionOrNullable<boolean>;
      tokenStandard: OptionOrNullable<TokenStandardArgs>;
      collection: OptionOrNullable<CollectionArgs>;
      uses: OptionOrNullable<UsesArgs>;
      collectionDetails: OptionOrNullable<CollectionDetailsArgs>;
      programmableConfig: OptionOrNullable<ProgrammableConfigArgs>;
      delegateState: OptionOrNullable<DelegateStateArgs>;
      authorityType: AuthorityTypeArgs;
    }>([
      ['discriminator', getU8Encoder()],
      ['updateV1Discriminator', getU8Encoder()],
      ['authorizationData', getOptionEncoder(getAuthorizationDataEncoder())],
      ['newUpdateAuthority', getOptionEncoder(getAddressEncoder())],
      [
        'data',
        getOptionEncoder(
          getStructEncoder<{
            name: string;
            symbol: string;
            uri: string;
            sellerFeeBasisPoints: number;
            creators: OptionOrNullable<Array<CreatorArgs>>;
          }>([
            ['name', getStringEncoder()],
            ['symbol', getStringEncoder()],
            ['uri', getStringEncoder()],
            ['sellerFeeBasisPoints', getU16Encoder()],
            [
              'creators',
              getOptionEncoder(getArrayEncoder(getCreatorEncoder())),
            ],
          ])
        ),
      ],
      ['primarySaleHappened', getOptionEncoder(getBooleanEncoder())],
      ['isMutable', getOptionEncoder(getBooleanEncoder())],
      ['tokenStandard', getOptionEncoder(getTokenStandardEncoder())],
      ['collection', getOptionEncoder(getCollectionEncoder())],
      ['uses', getOptionEncoder(getUsesEncoder())],
      ['collectionDetails', getOptionEncoder(getCollectionDetailsEncoder())],
      ['programmableConfig', getOptionEncoder(getProgrammableConfigEncoder())],
      ['delegateState', getOptionEncoder(getDelegateStateEncoder())],
      ['authorityType', getAuthorityTypeEncoder()],
    ]),
    (value) => ({
      ...value,
      discriminator: 43,
      updateV1Discriminator: 0,
      tokenStandard: value.tokenStandard ?? some(TokenStandard.NonFungible),
    })
  ) satisfies Encoder<UpdateV1InstructionDataArgs>;
}

export function getUpdateV1InstructionDataDecoder() {
  return getStructDecoder<UpdateV1InstructionData>([
    ['discriminator', getU8Decoder()],
    ['updateV1Discriminator', getU8Decoder()],
    ['authorizationData', getOptionDecoder(getAuthorizationDataDecoder())],
    ['newUpdateAuthority', getOptionDecoder(getAddressDecoder())],
    [
      'data',
      getOptionDecoder(
        getStructDecoder<{
          name: string;
          symbol: string;
          uri: string;
          sellerFeeBasisPoints: number;
          creators: Option<Array<Creator>>;
        }>([
          ['name', getStringDecoder()],
          ['symbol', getStringDecoder()],
          ['uri', getStringDecoder()],
          ['sellerFeeBasisPoints', getU16Decoder()],
          ['creators', getOptionDecoder(getArrayDecoder(getCreatorDecoder()))],
        ])
      ),
    ],
    ['primarySaleHappened', getOptionDecoder(getBooleanDecoder())],
    ['isMutable', getOptionDecoder(getBooleanDecoder())],
    ['tokenStandard', getOptionDecoder(getTokenStandardDecoder())],
    ['collection', getOptionDecoder(getCollectionDecoder())],
    ['uses', getOptionDecoder(getUsesDecoder())],
    ['collectionDetails', getOptionDecoder(getCollectionDetailsDecoder())],
    ['programmableConfig', getOptionDecoder(getProgrammableConfigDecoder())],
    ['delegateState', getOptionDecoder(getDelegateStateDecoder())],
    ['authorityType', getAuthorityTypeDecoder()],
  ]) satisfies Decoder<UpdateV1InstructionData>;
}

export function getUpdateV1InstructionDataCodec(): Codec<
  UpdateV1InstructionDataArgs,
  UpdateV1InstructionData
> {
  return combineCodec(
    getUpdateV1InstructionDataEncoder(),
    getUpdateV1InstructionDataDecoder()
  );
}

function _createInstruction<
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  TAccountAuthority extends string | IAccountMeta<string> = string,
  TAccountMetadata extends string | IAccountMeta<string> = string,
  TAccountMasterEdition extends string | IAccountMeta<string> = string,
  TAccountMint extends string | IAccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountSysvarInstructions extends
    | string
    | IAccountMeta<string> = 'Sysvar1nstructions1111111111111111111111111',
  TAccountToken extends string | IAccountMeta<string> = string,
  TAccountDelegateRecord extends string | IAccountMeta<string> = string,
  TAccountAuthorizationRulesProgram extends
    | string
    | IAccountMeta<string> = string,
  TAccountAuthorizationRules extends string | IAccountMeta<string> = string,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
>(
  accounts: {
    authority: TAccountAuthority extends string
      ? Address<TAccountAuthority>
      : TAccountAuthority;
    metadata: TAccountMetadata extends string
      ? Address<TAccountMetadata>
      : TAccountMetadata;
    masterEdition?: TAccountMasterEdition extends string
      ? Address<TAccountMasterEdition>
      : TAccountMasterEdition;
    mint: TAccountMint extends string ? Address<TAccountMint> : TAccountMint;
    systemProgram?: TAccountSystemProgram extends string
      ? Address<TAccountSystemProgram>
      : TAccountSystemProgram;
    sysvarInstructions?: TAccountSysvarInstructions extends string
      ? Address<TAccountSysvarInstructions>
      : TAccountSysvarInstructions;
    token?: TAccountToken extends string
      ? Address<TAccountToken>
      : TAccountToken;
    delegateRecord?: TAccountDelegateRecord extends string
      ? Address<TAccountDelegateRecord>
      : TAccountDelegateRecord;
    authorizationRulesProgram?: TAccountAuthorizationRulesProgram extends string
      ? Address<TAccountAuthorizationRulesProgram>
      : TAccountAuthorizationRulesProgram;
    authorizationRules?: TAccountAuthorizationRules extends string
      ? Address<TAccountAuthorizationRules>
      : TAccountAuthorizationRules;
  },
  args: UpdateV1InstructionDataArgs,
  programAddress: Address<TProgram> = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<TProgram>,
  remainingAccounts?: TRemainingAccounts
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.authority, AccountRole.READONLY_SIGNER),
      accountMetaWithDefault(accounts.metadata, AccountRole.WRITABLE),
      accountMetaWithDefault(
        accounts.masterEdition ?? {
          address:
            'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>,
          role: AccountRole.READONLY,
        },
        AccountRole.WRITABLE
      ),
      accountMetaWithDefault(accounts.mint, AccountRole.READONLY),
      accountMetaWithDefault(
        accounts.systemProgram ?? {
          address:
            '11111111111111111111111111111111' as Address<'11111111111111111111111111111111'>,
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
        accounts.token ?? {
          address:
            'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>,
          role: AccountRole.READONLY,
        },
        AccountRole.READONLY
      ),
      accountMetaWithDefault(
        accounts.delegateRecord ?? {
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
    data: getUpdateV1InstructionDataEncoder().encode(args),
    programAddress,
  } as UpdateV1Instruction<
    TProgram,
    TAccountAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountMint,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountToken,
    TAccountDelegateRecord,
    TAccountAuthorizationRulesProgram,
    TAccountAuthorizationRules,
    TRemainingAccounts
  >;
}

// Input.
export type UpdateV1Input<
  TAccountAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountSystemProgram extends string,
  TAccountSysvarInstructions extends string,
  TAccountToken extends string,
  TAccountDelegateRecord extends string,
  TAccountAuthorizationRulesProgram extends string,
  TAccountAuthorizationRules extends string
> = {
  /** Update authority or delegate */
  authority?: Address<TAccountAuthority>;
  /** Metadata account */
  metadata: Address<TAccountMetadata>;
  /** Master Edition account */
  masterEdition?: Address<TAccountMasterEdition>;
  /** Mint account */
  mint: Address<TAccountMint>;
  /** System program */
  systemProgram?: Address<TAccountSystemProgram>;
  /** System program */
  sysvarInstructions?: Address<TAccountSysvarInstructions>;
  /** Token account */
  token?: Address<TAccountToken>;
  /** Delegate record PDA */
  delegateRecord?: Address<TAccountDelegateRecord>;
  /** Token Authorization Rules Program */
  authorizationRulesProgram?: Address<TAccountAuthorizationRulesProgram>;
  /** Token Authorization Rules account */
  authorizationRules?: Address<TAccountAuthorizationRules>;
  authorizationData: UpdateV1InstructionDataArgs['authorizationData'];
  newUpdateAuthority: UpdateV1InstructionDataArgs['newUpdateAuthority'];
  data: UpdateV1InstructionDataArgs['data'];
  primarySaleHappened: UpdateV1InstructionDataArgs['primarySaleHappened'];
  isMutable: UpdateV1InstructionDataArgs['isMutable'];
  tokenStandard?: UpdateV1InstructionDataArgs['tokenStandard'];
  collection: UpdateV1InstructionDataArgs['collection'];
  uses: UpdateV1InstructionDataArgs['uses'];
  collectionDetails: UpdateV1InstructionDataArgs['collectionDetails'];
  programmableConfig: UpdateV1InstructionDataArgs['programmableConfig'];
  delegateState: UpdateV1InstructionDataArgs['delegateState'];
  authorityType: UpdateV1InstructionDataArgs['authorityType'];
};

// Input.
export type UpdateV1InputWithSigners<
  TAccountAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountSystemProgram extends string,
  TAccountSysvarInstructions extends string,
  TAccountToken extends string,
  TAccountDelegateRecord extends string,
  TAccountAuthorizationRulesProgram extends string,
  TAccountAuthorizationRules extends string
> = {
  /** Update authority or delegate */
  authority?: TransactionSigner<TAccountAuthority>;
  /** Metadata account */
  metadata: Address<TAccountMetadata>;
  /** Master Edition account */
  masterEdition?: Address<TAccountMasterEdition>;
  /** Mint account */
  mint: Address<TAccountMint>;
  /** System program */
  systemProgram?: Address<TAccountSystemProgram>;
  /** System program */
  sysvarInstructions?: Address<TAccountSysvarInstructions>;
  /** Token account */
  token?: Address<TAccountToken>;
  /** Delegate record PDA */
  delegateRecord?: Address<TAccountDelegateRecord>;
  /** Token Authorization Rules Program */
  authorizationRulesProgram?: Address<TAccountAuthorizationRulesProgram>;
  /** Token Authorization Rules account */
  authorizationRules?: Address<TAccountAuthorizationRules>;
  authorizationData: UpdateV1InstructionDataArgs['authorizationData'];
  newUpdateAuthority: UpdateV1InstructionDataArgs['newUpdateAuthority'];
  data: UpdateV1InstructionDataArgs['data'];
  primarySaleHappened: UpdateV1InstructionDataArgs['primarySaleHappened'];
  isMutable: UpdateV1InstructionDataArgs['isMutable'];
  tokenStandard?: UpdateV1InstructionDataArgs['tokenStandard'];
  collection: UpdateV1InstructionDataArgs['collection'];
  uses: UpdateV1InstructionDataArgs['uses'];
  collectionDetails: UpdateV1InstructionDataArgs['collectionDetails'];
  programmableConfig: UpdateV1InstructionDataArgs['programmableConfig'];
  delegateState: UpdateV1InstructionDataArgs['delegateState'];
  authorityType: UpdateV1InstructionDataArgs['authorityType'];
};

// Input.
export type UpdateV1AsyncInput<
  TAccountAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountSystemProgram extends string,
  TAccountSysvarInstructions extends string,
  TAccountToken extends string,
  TAccountDelegateRecord extends string,
  TAccountAuthorizationRulesProgram extends string,
  TAccountAuthorizationRules extends string
> = {
  /** Update authority or delegate */
  authority?: Address<TAccountAuthority>;
  /** Metadata account */
  metadata: Address<TAccountMetadata>;
  /** Master Edition account */
  masterEdition?: Address<TAccountMasterEdition>;
  /** Mint account */
  mint: Address<TAccountMint>;
  /** System program */
  systemProgram?: Address<TAccountSystemProgram>;
  /** System program */
  sysvarInstructions?: Address<TAccountSysvarInstructions>;
  /** Token account */
  token?: Address<TAccountToken>;
  /** Delegate record PDA */
  delegateRecord?: Address<TAccountDelegateRecord>;
  /** Token Authorization Rules Program */
  authorizationRulesProgram?: Address<TAccountAuthorizationRulesProgram>;
  /** Token Authorization Rules account */
  authorizationRules?: Address<TAccountAuthorizationRules>;
  authorizationData: UpdateV1InstructionDataArgs['authorizationData'];
  newUpdateAuthority: UpdateV1InstructionDataArgs['newUpdateAuthority'];
  data: UpdateV1InstructionDataArgs['data'];
  primarySaleHappened: UpdateV1InstructionDataArgs['primarySaleHappened'];
  isMutable: UpdateV1InstructionDataArgs['isMutable'];
  tokenStandard?: UpdateV1InstructionDataArgs['tokenStandard'];
  collection: UpdateV1InstructionDataArgs['collection'];
  uses: UpdateV1InstructionDataArgs['uses'];
  collectionDetails: UpdateV1InstructionDataArgs['collectionDetails'];
  programmableConfig: UpdateV1InstructionDataArgs['programmableConfig'];
  delegateState: UpdateV1InstructionDataArgs['delegateState'];
  authorityType: UpdateV1InstructionDataArgs['authorityType'];
};

// Input.
export type UpdateV1AsyncInputWithSigners<
  TAccountAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountSystemProgram extends string,
  TAccountSysvarInstructions extends string,
  TAccountToken extends string,
  TAccountDelegateRecord extends string,
  TAccountAuthorizationRulesProgram extends string,
  TAccountAuthorizationRules extends string
> = {
  /** Update authority or delegate */
  authority?: TransactionSigner<TAccountAuthority>;
  /** Metadata account */
  metadata: Address<TAccountMetadata>;
  /** Master Edition account */
  masterEdition?: Address<TAccountMasterEdition>;
  /** Mint account */
  mint: Address<TAccountMint>;
  /** System program */
  systemProgram?: Address<TAccountSystemProgram>;
  /** System program */
  sysvarInstructions?: Address<TAccountSysvarInstructions>;
  /** Token account */
  token?: Address<TAccountToken>;
  /** Delegate record PDA */
  delegateRecord?: Address<TAccountDelegateRecord>;
  /** Token Authorization Rules Program */
  authorizationRulesProgram?: Address<TAccountAuthorizationRulesProgram>;
  /** Token Authorization Rules account */
  authorizationRules?: Address<TAccountAuthorizationRules>;
  authorizationData: UpdateV1InstructionDataArgs['authorizationData'];
  newUpdateAuthority: UpdateV1InstructionDataArgs['newUpdateAuthority'];
  data: UpdateV1InstructionDataArgs['data'];
  primarySaleHappened: UpdateV1InstructionDataArgs['primarySaleHappened'];
  isMutable: UpdateV1InstructionDataArgs['isMutable'];
  tokenStandard?: UpdateV1InstructionDataArgs['tokenStandard'];
  collection: UpdateV1InstructionDataArgs['collection'];
  uses: UpdateV1InstructionDataArgs['uses'];
  collectionDetails: UpdateV1InstructionDataArgs['collectionDetails'];
  programmableConfig: UpdateV1InstructionDataArgs['programmableConfig'];
  delegateState: UpdateV1InstructionDataArgs['delegateState'];
  authorityType: UpdateV1InstructionDataArgs['authorityType'];
};

export async function updateV1<
  TAccountAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountSystemProgram extends string,
  TAccountSysvarInstructions extends string,
  TAccountToken extends string,
  TAccountDelegateRecord extends string,
  TAccountAuthorizationRulesProgram extends string,
  TAccountAuthorizationRules extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: UpdateV1AsyncInputWithSigners<
    TAccountAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountMint,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountToken,
    TAccountDelegateRecord,
    TAccountAuthorizationRulesProgram,
    TAccountAuthorizationRules
  >
): Promise<
  UpdateV1InstructionWithSigners<
    TProgram,
    ReadonlySignerAccount<TAccountAuthority> &
      IAccountSignerMeta<TAccountAuthority>,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountMint,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountToken,
    TAccountDelegateRecord,
    TAccountAuthorizationRulesProgram,
    TAccountAuthorizationRules
  >
>;
export async function updateV1<
  TAccountAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountSystemProgram extends string,
  TAccountSysvarInstructions extends string,
  TAccountToken extends string,
  TAccountDelegateRecord extends string,
  TAccountAuthorizationRulesProgram extends string,
  TAccountAuthorizationRules extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  context: Pick<Context, 'getProgramAddress'>,
  input: UpdateV1AsyncInput<
    TAccountAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountMint,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountToken,
    TAccountDelegateRecord,
    TAccountAuthorizationRulesProgram,
    TAccountAuthorizationRules
  >
): Promise<
  UpdateV1Instruction<
    TProgram,
    ReadonlySignerAccount<TAccountAuthority> &
      IAccountSignerMeta<TAccountAuthority>,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountMint,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountToken,
    TAccountDelegateRecord,
    TAccountAuthorizationRulesProgram,
    TAccountAuthorizationRules
  >
>;
export async function updateV1<
  TAccountAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountSystemProgram extends string,
  TAccountSysvarInstructions extends string,
  TAccountToken extends string,
  TAccountDelegateRecord extends string,
  TAccountAuthorizationRulesProgram extends string,
  TAccountAuthorizationRules extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  input: UpdateV1AsyncInputWithSigners<
    TAccountAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountMint,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountToken,
    TAccountDelegateRecord,
    TAccountAuthorizationRulesProgram,
    TAccountAuthorizationRules
  >
): Promise<
  UpdateV1InstructionWithSigners<
    TProgram,
    ReadonlySignerAccount<TAccountAuthority> &
      IAccountSignerMeta<TAccountAuthority>,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountMint,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountToken,
    TAccountDelegateRecord,
    TAccountAuthorizationRulesProgram,
    TAccountAuthorizationRules
  >
>;
export async function updateV1<
  TAccountAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountSystemProgram extends string,
  TAccountSysvarInstructions extends string,
  TAccountToken extends string,
  TAccountDelegateRecord extends string,
  TAccountAuthorizationRulesProgram extends string,
  TAccountAuthorizationRules extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  input: UpdateV1AsyncInput<
    TAccountAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountMint,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountToken,
    TAccountDelegateRecord,
    TAccountAuthorizationRulesProgram,
    TAccountAuthorizationRules
  >
): Promise<
  UpdateV1Instruction<
    TProgram,
    ReadonlySignerAccount<TAccountAuthority> &
      IAccountSignerMeta<TAccountAuthority>,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountMint,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountToken,
    TAccountDelegateRecord,
    TAccountAuthorizationRulesProgram,
    TAccountAuthorizationRules
  >
>;
export async function updateV1<
  TReturn,
  TAccountAuthority extends string,
  TAccountMetadata extends string,
  TAccountMasterEdition extends string,
  TAccountMint extends string,
  TAccountSystemProgram extends string,
  TAccountSysvarInstructions extends string,
  TAccountToken extends string,
  TAccountDelegateRecord extends string,
  TAccountAuthorizationRulesProgram extends string,
  TAccountAuthorizationRules extends string,
  TProgram extends string = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
>(
  rawContext:
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>)
    | UpdateV1AsyncInput<
        TAccountAuthority,
        TAccountMetadata,
        TAccountMasterEdition,
        TAccountMint,
        TAccountSystemProgram,
        TAccountSysvarInstructions,
        TAccountToken,
        TAccountDelegateRecord,
        TAccountAuthorizationRulesProgram,
        TAccountAuthorizationRules
      >,
  rawInput?: UpdateV1AsyncInput<
    TAccountAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountMint,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountToken,
    TAccountDelegateRecord,
    TAccountAuthorizationRulesProgram,
    TAccountAuthorizationRules
  >
): Promise<IInstruction> {
  // Resolve context and input arguments.
  const context = (rawInput === undefined ? {} : rawContext) as
    | Pick<Context, 'getProgramAddress'>
    | (Pick<Context, 'getProgramAddress'> &
        CustomGeneratedInstruction<IInstruction, TReturn>);
  const input = (
    rawInput === undefined ? rawContext : rawInput
  ) as UpdateV1AsyncInput<
    TAccountAuthority,
    TAccountMetadata,
    TAccountMasterEdition,
    TAccountMint,
    TAccountSystemProgram,
    TAccountSysvarInstructions,
    TAccountToken,
    TAccountDelegateRecord,
    TAccountAuthorizationRulesProgram,
    TAccountAuthorizationRules
  >;

  // Program address.
  const defaultProgramAddress =
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as Address<'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'>;
  const programAddress = (
    context.getProgramAddress
      ? await context.getProgramAddress({
          name: 'mplTokenMetadata',
          address: defaultProgramAddress,
        })
      : defaultProgramAddress
  ) as Address<TProgram>;

  // Original accounts.
  type AccountMetas = Parameters<
    typeof _createInstruction<
      TProgram,
      TAccountAuthority,
      TAccountMetadata,
      TAccountMasterEdition,
      TAccountMint,
      TAccountSystemProgram,
      TAccountSysvarInstructions,
      TAccountToken,
      TAccountDelegateRecord,
      TAccountAuthorizationRulesProgram,
      TAccountAuthorizationRules
    >
  >[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    authority: { value: input.authority ?? null, isWritable: false },
    metadata: { value: input.metadata ?? null, isWritable: true },
    masterEdition: { value: input.masterEdition ?? null, isWritable: true },
    mint: { value: input.mint ?? null, isWritable: false },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
    sysvarInstructions: {
      value: input.sysvarInstructions ?? null,
      isWritable: false,
    },
    token: { value: input.token ?? null, isWritable: false },
    delegateRecord: { value: input.delegateRecord ?? null, isWritable: false },
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
    accounts.systemProgram.value = await getProgramAddress(
      context,
      'splSystem',
      '11111111111111111111111111111111'
    );
    accounts.systemProgram.isWritable = false;
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

  // Remaining accounts.
  const remainingAccounts: IAccountMeta[] = [];

  // Bytes created on chain.
  const bytesCreatedOnChain = 0;

  return _createInstruction(
    accountMetas as Record<keyof AccountMetas, IAccountMeta>,
    args as UpdateV1InstructionDataArgs,
    programAddress,
    bytesCreatedOnChain,
    remainingAccounts
  );
}
