/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  AccountMeta,
  Context,
  Option,
  Pda,
  PublicKey,
  Serializer,
  Signer,
  TransactionBuilder,
  mapSerializer,
  publicKey,
  some,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { addObjectProperty } from '../shared';
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
  getAuthorityTypeSerializer,
  getAuthorizationDataSerializer,
  getCollectionDetailsSerializer,
  getCollectionSerializer,
  getCreatorSerializer,
  getDelegateStateSerializer,
  getProgrammableConfigSerializer,
  getTokenStandardSerializer,
  getUsesSerializer,
  payloadType,
} from '../types';

// Accounts.
export type UpdateV1InstructionAccounts = {
  /** Update authority or delegate */
  authority?: Signer;
  /** Metadata account */
  metadata: PublicKey | Pda;
  /** Master Edition account */
  masterEdition?: PublicKey | Pda;
  /** Mint account */
  mint: PublicKey | Pda;
  /** System program */
  systemProgram?: PublicKey | Pda;
  /** System program */
  sysvarInstructions?: PublicKey | Pda;
  /** Token account */
  token?: PublicKey | Pda;
  /** Delegate record PDA */
  delegateRecord?: PublicKey | Pda;
  /** Token Authorization Rules Program */
  authorizationRulesProgram?: PublicKey | Pda;
  /** Token Authorization Rules account */
  authorizationRules?: PublicKey | Pda;
};

// Data.
export type UpdateV1InstructionData = {
  discriminator: number;
  updateV1Discriminator: number;
  authorizationData: Option<AuthorizationData>;
  newUpdateAuthority: Option<PublicKey>;
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
  authorizationData: Option<AuthorizationDataArgs>;
  newUpdateAuthority: Option<PublicKey>;
  data: Option<{
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: Option<Array<CreatorArgs>>;
  }>;
  primarySaleHappened: Option<boolean>;
  isMutable: Option<boolean>;
  tokenStandard?: Option<TokenStandardArgs>;
  collection?: Option<CollectionArgs>;
  uses: Option<UsesArgs>;
  collectionDetails: Option<CollectionDetailsArgs>;
  programmableConfig: Option<ProgrammableConfigArgs>;
  delegateState: Option<DelegateStateArgs>;
  authorityType: AuthorityTypeArgs;
};

export function getUpdateV1InstructionDataSerializer(
  context: Pick<Context, 'serializer'>
): Serializer<UpdateV1InstructionDataArgs, UpdateV1InstructionData> {
  const s = context.serializer;
  return mapSerializer<
    UpdateV1InstructionDataArgs,
    any,
    UpdateV1InstructionData
  >(
    s.struct<UpdateV1InstructionData>(
      [
        ['discriminator', s.u8()],
        ['updateV1Discriminator', s.u8()],
        [
          'authorizationData',
          s.option(getAuthorizationDataSerializer(context)),
        ],
        ['newUpdateAuthority', s.option(s.publicKey())],
        [
          'data',
          s.option(
            s.struct<any>([
              ['name', s.string()],
              ['symbol', s.string()],
              ['uri', s.string()],
              ['sellerFeeBasisPoints', s.u16()],
              ['creators', s.option(s.array(getCreatorSerializer(context)))],
            ])
          ),
        ],
        ['primarySaleHappened', s.option(s.bool())],
        ['isMutable', s.option(s.bool())],
        ['tokenStandard', s.option(getTokenStandardSerializer(context))],
        ['collection', s.option(getCollectionSerializer(context))],
        ['uses', s.option(getUsesSerializer(context))],
        [
          'collectionDetails',
          s.option(getCollectionDetailsSerializer(context)),
        ],
        [
          'programmableConfig',
          s.option(getProgrammableConfigSerializer(context)),
        ],
        ['delegateState', s.option(getDelegateStateSerializer(context))],
        ['authorityType', getAuthorityTypeSerializer(context)],
      ],
      { description: 'UpdateV1InstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: 43,
      updateV1Discriminator: 0,
      tokenStandard: value.tokenStandard ?? some(TokenStandard.NonFungible),
      collection:
        value.collection ??
        some(
          payloadType('Pubkey', [publicKey('11111111111111111111111111111111')])
        ),
    })
  ) as Serializer<UpdateV1InstructionDataArgs, UpdateV1InstructionData>;
}

// Args.
export type UpdateV1InstructionArgs = UpdateV1InstructionDataArgs;

// Instruction.
export function updateV1(
  context: Pick<Context, 'serializer' | 'programs' | 'identity'>,
  input: UpdateV1InstructionAccounts & UpdateV1InstructionArgs
): TransactionBuilder {
  const signers: Signer[] = [];
  const keys: AccountMeta[] = [];

  // Program ID.
  const programId = context.programs.getPublicKey(
    'mplTokenMetadata',
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
  );

  // Resolved inputs.
  const resolvedAccounts = {
    metadata: [input.metadata, true] as const,
    mint: [input.mint, false] as const,
  };
  const resolvingArgs = {};
  addObjectProperty(
    resolvedAccounts,
    'authority',
    input.authority
      ? ([input.authority, false] as const)
      : ([context.identity, false] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'masterEdition',
    input.masterEdition
      ? ([input.masterEdition, true] as const)
      : ([programId, false] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'systemProgram',
    input.systemProgram
      ? ([input.systemProgram, false] as const)
      : ([
          context.programs.getPublicKey(
            'splSystem',
            '11111111111111111111111111111111'
          ),
          false,
        ] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'sysvarInstructions',
    input.sysvarInstructions
      ? ([input.sysvarInstructions, false] as const)
      : ([
          publicKey('Sysvar1nstructions1111111111111111111111111'),
          false,
        ] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'token',
    input.token
      ? ([input.token, false] as const)
      : ([programId, false] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'delegateRecord',
    input.delegateRecord
      ? ([input.delegateRecord, false] as const)
      : ([programId, false] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'authorizationRulesProgram',
    input.authorizationRulesProgram
      ? ([input.authorizationRulesProgram, false] as const)
      : ([programId, false] as const)
  );
  addObjectProperty(
    resolvedAccounts,
    'authorizationRules',
    input.authorizationRules
      ? ([input.authorizationRules, false] as const)
      : ([programId, false] as const)
  );
  const resolvedArgs = { ...input, ...resolvingArgs };

  // Authority.
  signers.push(resolvedAccounts.authority[0]);
  keys.push({
    pubkey: resolvedAccounts.authority[0].publicKey,
    isSigner: true,
    isWritable: resolvedAccounts.authority[1],
  });

  // Metadata.
  keys.push({
    pubkey: publicKey(resolvedAccounts.metadata[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.metadata[1],
  });

  // Master Edition.
  keys.push({
    pubkey: publicKey(resolvedAccounts.masterEdition[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.masterEdition[1],
  });

  // Mint.
  keys.push({
    pubkey: publicKey(resolvedAccounts.mint[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.mint[1],
  });

  // System Program.
  keys.push({
    pubkey: publicKey(resolvedAccounts.systemProgram[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.systemProgram[1],
  });

  // Sysvar Instructions.
  keys.push({
    pubkey: publicKey(resolvedAccounts.sysvarInstructions[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.sysvarInstructions[1],
  });

  // Token.
  keys.push({
    pubkey: publicKey(resolvedAccounts.token[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.token[1],
  });

  // Delegate Record.
  keys.push({
    pubkey: publicKey(resolvedAccounts.delegateRecord[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.delegateRecord[1],
  });

  // Authorization Rules Program.
  keys.push({
    pubkey: publicKey(resolvedAccounts.authorizationRulesProgram[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.authorizationRulesProgram[1],
  });

  // Authorization Rules.
  keys.push({
    pubkey: publicKey(resolvedAccounts.authorizationRules[0], false),
    isSigner: false,
    isWritable: resolvedAccounts.authorizationRules[1],
  });

  // Data.
  const data =
    getUpdateV1InstructionDataSerializer(context).serialize(resolvedArgs);

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
