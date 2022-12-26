const {
  RenderJavaScriptVisitor,
  Kinobi,
  PrintVisitor,
} = require('../dist/index.js');

const kinobi = new Kinobi(__dirname + '/mpl_token_metadata.json');
kinobi.accept(new PrintVisitor());
kinobi.accept(new RenderJavaScriptVisitor('./package/src/generated'));
