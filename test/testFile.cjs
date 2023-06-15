const k = require('../dist/cjs/index.js');

const kinobi = k.createFromIdls([
  __dirname + '/mpl_candy_machine_core.json',
  __dirname + '/mpl_token_auth_rules.json',
  __dirname + '/mpl_token_metadata.json',
]);

kinobi.update(
  new k.UpdateProgramsVisitor({
    candyMachineCore: { name: 'mplCandyMachineCore', prefix: 'Cm' },
    mplTokenAuthRules: { prefix: 'Ta' },
    mplTokenMetadata: { prefix: 'Tm' },
  })
);

kinobi.update(
  new k.UpdateAccountsVisitor({
    Metadata: { size: 679 },
    MasterEditionV1: {
      seeds: [
        k.stringConstantSeed('metadata'),
        k.programSeed(),
        k.variableSeed(
          'delegateRole',
          k.linkTypeNode('delegateRole'),
          'The role of the delegate'
        ),
      ],
    },
    MasterEditionV2: {
      size: 282,
      seeds: [
        k.stringConstantSeed('metadata'),
        k.programSeed(),
        k.publicKeySeed('mint', 'The address of the mint account'),
        k.stringConstantSeed('edition'),
      ],
    },
    delegateRecord: {
      size: 282,
      seeds: [
        k.stringConstantSeed('delegate_record'),
        k.programSeed(),
        k.variableSeed(
          'role',
          k.linkTypeNode('delegateRole'),
          'The delegate role'
        ),
      ],
    },
    FrequencyAccount: {
      seeds: [k.stringConstantSeed('frequency_pda'), k.programSeed()],
    },
  })
);

kinobi.update(
  new k.UpdateDefinedTypesVisitor({
    'mplCandyMachineCore.Creator': { name: 'CmCreator' },
    'mplTokenAuthRules.Key': { name: 'TaKey' },
    'mplTokenMetadata.Key': { name: 'TmKey' },
    'mplTokenMetadata.CreateArgs': { name: 'TmCreateArgs' },
    'mplTokenAuthRules.CreateArgs': { name: 'TaCreateArgs' },
  })
);

kinobi.update(
  new k.UpdateInstructionsVisitor({
    'mplTokenAuthRules.Create': {
      name: 'CreateRuleSet',
      args: {
        ruleSetBump: { defaultsTo: k.accountBumpDefault('ruleSetPda') },
      },
    },
    'mplCandyMachineCore.Update': { name: 'UpdateCandyMachine' },
    CreateMetadataAccount: {
      bytesCreatedOnChain: k.bytesFromAccount('Metadata'),
      accounts: {
        metadata: { defaultsTo: k.pdaDefault('metadata') },
      },
      args: {
        metadataBump: { defaultsTo: k.accountBumpDefault('metadata') },
      },
    },
    CreateMetadataAccountV3: {
      accounts: {
        metadata: { defaultsTo: k.pdaDefault('metadata') },
      },
    },
    CreateMasterEditionV3: {
      bytesCreatedOnChain: k.bytesFromAccount('MasterEditionV2'),
    },
    'mplCandyMachineCore.Mint': {
      name: 'MintFromCandyMachine',
      accounts: {
        nftMintAuthority: { defaultsTo: k.identityDefault() },
      },
    },
    Dummy: {
      accounts: {
        mintAuthority: { defaultsTo: k.accountDefault('updateAuthority') },
        edition: { defaultsTo: k.accountDefault('mint') },
        foo: { defaultsTo: k.accountDefault('bar') },
        bar: { defaultsTo: k.programIdDefault() },
        delegateRecord: {
          defaultsTo: k.pdaDefault('delegateRecord', {
            seeds: {
              role: k.valueDefault(k.vEnum('delegateRole', 'Collection')),
            },
          }),
        },
      },
      args: {
        identityArg: {
          type: k.publicKeyTypeNode(),
          defaultsTo: k.identityDefault(),
        },
      },
    },
    DeprecatedCreateReservationList: { name: 'CreateReservationList' },
    Transfer: {
      accounts: {
        masterEdition: {
          defaultsTo: k.resolverDefault(
            'resolveMasterEditionFromTokenStandard',
            [k.dependsOnAccount('mint'), k.dependsOnArg('tokenStandard')]
          ),
        },
      },
      args: {
        tokenStandard: {
          type: k.linkTypeNode('tokenStandard'),
          defaultsTo: k.valueDefault(k.vEnum('tokenStandard', 'NonFungible')),
        },
      },
    },
  })
);

const tmKey = (name) => ({ field: 'key', value: k.vEnum('TmKey', name) });
const taKey = (name) => ({ field: 'key', value: k.vEnum('TaKey', name) });
kinobi.update(
  new k.SetAccountDiscriminatorFromFieldVisitor({
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

// Custom serializers.
kinobi.update(
  new k.UseCustomAccountSerializerVisitor({
    ReservationListV1: { extract: true },
  })
);
kinobi.update(
  new k.UseCustomInstructionSerializerVisitor({
    CreateReservationList: true,
  })
);

kinobi.update(
  new k.SetStructDefaultValuesVisitor({
    'mplTokenMetadata.Collection': {
      verified: k.vScalar(false),
    },
    'mplTokenMetadata.UpdateArgs.V1': {
      tokenStandard: k.vSome(k.vEnum('TokenStandard', 'NonFungible')),
      collection: k.vSome(
        k.vEnum(
          'PayloadType',
          'Pubkey',
          k.vTuple([k.vPublicKey('1'.repeat(32))])
        )
      ),
    },
  })
);

kinobi.update(
  new k.SetNumberWrappersVisitor({
    'DelegateArgs.SaleV1.amount': { kind: 'SolAmount' },
    'CandyMachineData.sellerFeeBasisPoints': {
      kind: 'Amount',
      identifier: '%',
      decimals: 2,
    },
  })
);

kinobi.update(new k.UnwrapDefinedTypesVisitor(['Data']));
kinobi.update(
  new k.FlattenStructVisitor({
    'mplTokenMetadata.Metadata': ['Data'],
  })
);

kinobi.update(
  new k.CreateSubInstructionsFromEnumArgsVisitor({
    'mplTokenMetadata.Create': 'createArgs',
    'mplTokenMetadata.Update': 'updateArgs',
  })
);

kinobi.update(new k.UnwrapTupleEnumWithSingleStructVisitor(['payloadType']));

const kinobiJson = kinobi.getJson();
const kinobiReconstructed = k.createFromJson(kinobiJson);

// kinobi.accept(new k.ConsoleLogVisitor(new k.GetNodeTreeStringVisitor()));
kinobiReconstructed.accept(
  new k.RenderJavaScriptVisitor('./test/package/src/generated')
);
