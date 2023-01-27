const {
  RenderJavaScriptVisitor,
  Kinobi,
  ConsoleLogVisitor,
  GetNodeTreeStringVisitor,
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
    'mplTokenMetadata.Create': { name: 'CreateDigitalAsset' },
    'mplTokenMetadata.Update': { name: 'UpdateDigitalAsset' },
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

const omitted = (v) => ({ ...vScalar(v), strategy: 'omitted' });
kinobi.update(
  new SetStructDefaultValuesVisitor({
    'mplTokenMetadata.Edition': { key: omitted(1) },
    'mplTokenMetadata.MasterEditionV1': { key: omitted(2) },
    'mplTokenMetadata.ReservationListV1': { key: omitted(3) },
    'mplTokenMetadata.Metadata': { key: omitted(4) },
    'mplTokenMetadata.ReservationListV2': { key: omitted(5) },
    'mplTokenMetadata.MasterEditionV2': { key: omitted(6) },
    'mplTokenMetadata.EditionMarker': { key: omitted(7) },
    'mplTokenMetadata.UseAuthorityRecord': { key: omitted(8) },
    'mplTokenMetadata.CollectionAuthorityRecord': { key: omitted(9) },
    'mplTokenMetadata.TokenOwnedEscrow': { key: omitted(10) },
    'mplTokenMetadata.DelegateRecord': { key: omitted(11) },
    'mplTokenAuthRules.FrequencyAccount': { key: omitted(1) },
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

// kinobi.accept(new ConsoleLogVisitor(new GetNodeTreeStringVisitor()));
kinobi.accept(new RenderJavaScriptVisitor('./package/src/generated'));
