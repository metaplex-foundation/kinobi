const {
  RenderJavaScriptVisitor,
  Kinobi,
  PrintVisitor,
  RenameNodesVisitor,
  ValidateNodesVisitor,
} = require('../dist/index.js');

const kinobi = new Kinobi(__dirname + '/mpl_token_metadata.json');
kinobi.update(
  new RenameNodesVisitor({
    mplTokenMetadata: {
      instructions: {
        Create: 'CreateDigitalAsset',
        Update: 'UpdateDigitalAsset',
      },
    },
  })
);
kinobi.accept(new ValidateNodesVisitor());
kinobi.accept(new PrintVisitor());
kinobi.accept(new RenderJavaScriptVisitor('./package/src/generated'));
