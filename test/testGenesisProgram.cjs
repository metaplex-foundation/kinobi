const k = require('../dist/cjs/index.js');

const kinobi = k.createFromIdls([__dirname + '/genesis_program.json']);

const kinobiJson = kinobi.getJson();
const kinobiReconstructed = k.createFromJson(kinobiJson);

/**
 * Render clients.
 */

kinobiReconstructed.accept(
  k.renderJavaScriptVisitor('./test/packages/genesis-js/src/generated')
);

kinobiReconstructed.accept(
  k.renderJavaScriptExperimentalVisitor(
    './test/packages/genesis-js-experimental/src/generated'
  )
);

kinobiReconstructed.accept(
  k.renderRustVisitor('./test/packages/genesis-rust/src/generated', {
    crateFolder: './test/packages/genesis-rust',
    formatCode: true,
  })
);
