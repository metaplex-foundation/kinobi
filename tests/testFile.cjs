const {
  Kinobi,
  ConsoleLogVisitor,
  CreateSubInstructionsFromEnumArgsVisitor,
  GetNodeTreeStringVisitor,
  RenderJavaScriptVisitor,
  SetAccountDiscriminatorFromFieldVisitor,
  SetStructDefaultValuesVisitor,
  SetLeafWrappersVisitor,
  TypeLeafNode,
  UnwrapDefinedTypesVisitor,
  UnwrapStructVisitor,
  UpdateAccountsVisitor,
  UpdateInstructionsVisitor,
  UpdateProgramsVisitor,
  UpdateDefinedTypesVisitor,
  vScalar,
  vSome,
  vEnum,
  vTuple,
  vPublicKey,
} = require('../dist/index.js');

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
    MasterEditionV2: {
      seeds: [
        { kind: 'literal', value: 'metadata' },
        { kind: 'programId' },
        {
          kind: 'variable',
          name: 'mint',
          description: 'The address of the mint account',
          type: new TypeLeafNode('publicKey'),
        },
        { kind: 'literal', value: 'edition' },
      ],
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
        metadata: { defaultsTo: { kind: 'pda' } },
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
      },
    },
  })
);

kinobi.update(
  new SetAccountDiscriminatorFromFieldVisitor({
    'mplTokenMetadata.Edition': {
      field: 'key',
      value: vEnum('TmKey', 'EditionV1'),
    },
    'mplTokenMetadata.MasterEditionV1': { field: 'key', value: vScalar(2) },
    'mplTokenMetadata.ReservationListV1': { field: 'key', value: vScalar(3) },
    'mplTokenMetadata.Metadata': { field: 'key', value: vScalar(4) },
    'mplTokenMetadata.ReservationListV2': { field: 'key', value: vScalar(5) },
    'mplTokenMetadata.MasterEditionV2': { field: 'key', value: vScalar(6) },
    'mplTokenMetadata.EditionMarker': { field: 'key', value: vScalar(7) },
    'mplTokenMetadata.UseAuthorityRecord': { field: 'key', value: vScalar(8) },
    'mplTokenMetadata.CollectionAuthorityRecord': {
      field: 'key',
      value: vScalar(9),
    },
    'mplTokenMetadata.TokenOwnedEscrow': { field: 'key', value: vScalar(10) },
    'mplTokenMetadata.DelegateRecord': { field: 'key', value: vScalar(11) },
    'mplTokenAuthRules.FrequencyAccount': { field: 'key', value: vScalar(1) },
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
  new SetLeafWrappersVisitor({
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
kinobi.accept(new RenderJavaScriptVisitor('./package/src/generated'));
