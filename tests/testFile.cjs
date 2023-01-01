const {
  RenderJavaScriptVisitor,
  Kinobi,
  RenameNodesVisitor,
  ValidateNodesVisitor,
  ConsoleLogVisitor,
  GetNodeTreeStringVisitor,
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
        Payload: 'TaPayload',
        PayloadKey: 'TaPayloadKey',
        PayloadType: 'TaPayloadType',
        SeedsVec: 'TaSeedsVec',
        LeafInfo: 'TaLeafInfo',
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
        Payload: 'TmPayload',
        PayloadKey: 'TmPayloadKey',
        PayloadType: 'TmPayloadType',
        SeedsVec: 'TmSeedsVec',
        LeafInfo: 'TmLeafInfo',
        CreateArgs: 'TmCreateArgs',
      },
    },
  })
);
kinobi.accept(new ValidateNodesVisitor());
kinobi.accept(new ConsoleLogVisitor(new GetNodeTreeStringVisitor()));
kinobi.accept(new RenderJavaScriptVisitor('./package/src/generated'));
