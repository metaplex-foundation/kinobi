const {
  Kinobi,
  ConsoleLogVisitor,
  CreateSubInstructionsFromEnumArgsVisitor,
  GetNodeTreeStringVisitor,
  RenderJavaScriptVisitor,
  SetAccountDiscriminatorFromFieldVisitor,
  SetStructDefaultValuesVisitor,
  SetNumberWrappersVisitor,
  TypePublicKeyNode,
  UnwrapDefinedTypesVisitor,
  UnwrapStructVisitor,
  UpdateAccountsVisitor,
  UpdateInstructionsVisitor,
  UpdateProgramsVisitor,
  UpdateDefinedTypesVisitor,
  TypeDefinedLinkNode,
  vScalar,
  vSome,
  vEnum,
  vTuple,
  vPublicKey,
} = require('../dist/cjs/index.js');
const { TypeNumberNode } = require('../dist/cjs/nodes/TypeNumberNode.js');

const kinobi = new Kinobi([
  __dirname + '/mpl_candy_machine_core.json',
  __dirname + '/mpl_token_auth_rules.json',
  __dirname + '/mpl_token_metadata.json',
]);

kinobi.update(
  new UpdateProgramsVisitor({
    candyMachineCore: { name: 'mplCandyMachineCore', prefix: 'Cm' },
    mplTokenAuthRules: { prefix: 'Ta' },
    mplTokenMetadata: { prefix: 'Tm' },
  })
);

kinobi.update(
  new UpdateAccountsVisitor({
    Metadata: {
      size: 679,
    },
    MasterEditionV1: {
      seeds: [
        { kind: 'literal', value: 'metadata' },
        { kind: 'programId' },
        {
          kind: 'variable',
          name: 'delegateRole',
          description: 'The role of the delegate',
          type: new TypeDefinedLinkNode('delegateRole'),
        },
      ],
    },
    MasterEditionV2: {
      size: 282,
      seeds: [
        { kind: 'literal', value: 'metadata' },
        { kind: 'programId' },
        {
          kind: 'variable',
          name: 'mint',
          description: 'The address of the mint account',
          type: new TypePublicKeyNode(),
        },
        { kind: 'literal', value: 'edition' },
      ],
    },
    delegateRecord: {
      size: 282,
      seeds: [
        { kind: 'literal', value: 'delegate_record' },
        { kind: 'programId' },
        {
          kind: 'variable',
          name: 'role',
          description: 'The delegate role',
          type: new TypeNumberNode('u8'),
        },
      ],
    },
    ReservationListV1: {
      link: true,
    },
  })
);

kinobi.update(
  new UpdateDefinedTypesVisitor({
    'mplCandyMachineCore.Creator': { name: 'CmCreator' },
    'mplTokenAuthRules.Key': { name: 'TaKey' },
    'mplTokenMetadata.Key': { name: 'TmKey' },
    'mplTokenMetadata.CreateArgs': { name: 'TmCreateArgs' },
    'mplTokenAuthRules.CreateArgs': { name: 'TaCreateArgs' },
  })
);

kinobi.update(
  new UpdateInstructionsVisitor({
    'mplTokenAuthRules.Create': { name: 'CreateRuleSet' },
    'mplCandyMachineCore.Update': { name: 'UpdateCandyMachine' },
    CreateMetadataAccount: {
      bytesCreatedOnChain: { kind: 'account', name: 'Metadata' },
      accounts: {
        metadata: { defaultsTo: { kind: 'pda' }, pdaBumpArg: 'metadataBump' },
      },
    },
    CreateMetadataAccountV3: {
      accounts: {
        metadata: { defaultsTo: { kind: 'pda' } },
      },
    },
    CreateMasterEditionV3: {
      bytesCreatedOnChain: { kind: 'account', name: 'MasterEditionV2' },
    },
    'mplCandyMachineCore.Mint': {
      name: 'MintFromCandyMachine',
      accounts: {
        nftMintAuthority: { defaultsTo: { kind: 'identity' } },
      },
    },
    Dummy: {
      accounts: {
        mintAuthority: {
          defaultsTo: { kind: 'account', name: 'updateAuthority' },
        },
        edition: { defaultsTo: { kind: 'account', name: 'mint' } },
        foo: { defaultsTo: { kind: 'account', name: 'bar' } },
        bar: { defaultsTo: { kind: 'programId' } },
        delegateRecord: {
          defaultsTo: {
            kind: 'pda',
            name: 'delegateRecord',
            seeds: {
              mint: { kind: 'account', name: 'foo' },
              role: { kind: 'value', value: vScalar(42) },
            },
          },
        },
      },
    },
    DeprecatedCreateReservationList: {
      name: 'CreateReservationList',
      link: true,
    },
  })
);

const tmKey = (name) => ({ field: 'key', value: vEnum('TmKey', name) });
const taKey = (name) => ({ field: 'key', value: vEnum('TaKey', name) });
kinobi.update(
  new SetAccountDiscriminatorFromFieldVisitor({
    'mplTokenMetadata.Edition': tmKey('EditionV1'),
    'mplTokenMetadata.MasterEditionV1': tmKey('MasterEditionV1'),
    'mplTokenMetadata.ReservationListV1': tmKey('ReservationListV1'),
    'mplTokenMetadata.Metadata': tmKey('MetadataV1'),
    'mplTokenMetadata.ReservationListV2': tmKey('ReservationListV2'),
    'mplTokenMetadata.MasterEditionV2': tmKey('MasterEditionV2'),
    'mplTokenMetadata.EditionMarker': tmKey('EditionMarker'),
    'mplTokenMetadata.UseAuthorityRecord': tmKey('UseAuthorityRecord'),
    'mplTokenMetadata.CollectionAuthorityRecord': tmKey(
      'CollectionAuthorityRecord'
    ),
    'mplTokenMetadata.TokenOwnedEscrow': tmKey('TokenOwnedEscrow'),
    'mplTokenMetadata.DelegateRecord': tmKey('Delegate'),
    'mplTokenAuthRules.FrequencyAccount': taKey('Frequency'),
  })
);

kinobi.update(
  new SetStructDefaultValuesVisitor({
    'mplTokenMetadata.Collection': { verified: vScalar(false) },
    'mplTokenMetadata.UpdateArgs.V1': {
      tokenStandard: vSome(vEnum('TokenStandard', 'NonFungible')),
      collection: vSome(
        vEnum('PayloadType', 'Pubkey', vTuple([vPublicKey('1'.repeat(32))]))
      ),
    },
  })
);

kinobi.update(
  new SetNumberWrappersVisitor({
    'DelegateArgs.SaleV1.amount': { kind: 'SolAmount' },
    'CandyMachineData.sellerFeeBasisPoints': {
      kind: 'Amount',
      identifier: '%',
      decimals: 2,
    },
  })
);

kinobi.update(new UnwrapDefinedTypesVisitor(['Data']));
kinobi.update(
  new UnwrapStructVisitor({
    'mplTokenMetadata.Metadata': ['Data'],
  })
);

kinobi.update(
  new CreateSubInstructionsFromEnumArgsVisitor({
    'mplTokenMetadata.Create': 'createArgs',
    'mplTokenMetadata.Update': 'updateArgs',
  })
);

// kinobi.accept(new ConsoleLogVisitor(new GetNodeTreeStringVisitor()));
kinobi.accept(new RenderJavaScriptVisitor('./test/package/src/generated'));
