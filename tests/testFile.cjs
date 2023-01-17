const {
  RenderJavaScriptVisitor,
  Kinobi,
  RenameNodesVisitor,
  ConsoleLogVisitor,
  GetNodeTreeStringVisitor,
  SetStructDefaultValuesVisitor,
  SetLeafWrappersVisitor,
  SetInstructionAccountDefaultValuesVisitor,
  SetAccountSeedsVisitor,
  TypeLeafNode,
  SetAccountSizesVisitor,
} = require('../dist/index.js');

const kinobi = new Kinobi([
  __dirname + '/mpl_candy_machine_core.json',
  __dirname + '/mpl_token_auth_rules.json',
  __dirname + '/mpl_token_metadata.json',
]);
kinobi.update(
  new RenameNodesVisitor({
    candyMachineCore: {
      name: 'mplCandyMachineCore',
      prefix: 'Cm',
      instructions: {
        Mint: 'MintFromCandyMachine',
      },
      types: {
        Creator: 'CmCreator',
      },
    },
    mplTokenAuthRules: {
      prefix: 'Ta',
      types: {
        Key: 'TaKey',
        CreateArgs: 'TaCreateArgs',
      },
    },
    mplTokenMetadata: {
      prefix: 'Tm',
      instructions: {
        Create: 'CreateDigitalAsset',
        Update: 'UpdateDigitalAsset',
      },
      types: {
        Key: 'TmKey',
        CreateArgs: 'TmCreateArgs',
      },
    },
  })
);
const omitted = (v) => ({ value: v, strategy: 'omitted' });
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
    'mplTokenMetadata.Collection': { verified: false },
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
kinobi.update(
  new SetInstructionAccountDefaultValuesVisitor([
    {
      instruction: 'MintFromCandyMachine',
      account: 'nftMintAuthority',
      kind: 'identity',
    },
  ])
);
kinobi.update(
  new SetAccountSeedsVisitor({
    MasterEditionV2: [
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
  })
);
kinobi.update(
  new SetAccountSizesVisitor({
    'mplCandyMachineCore.CandyMachine': 42,
  })
);
kinobi.accept(new ConsoleLogVisitor(new GetNodeTreeStringVisitor()));
kinobi.accept(new RenderJavaScriptVisitor('./package/src/generated'));
