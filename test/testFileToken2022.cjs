const fs = require('node:fs');
const k = require('../dist/cjs/index.js');

// Codama-standard IDL for SPL Token-2022 (Token Extensions).
// Source: https://github.com/solana-program/token-2022 (idl.json)
// Commit: f91ef31e4993d56b10a01b5995be7696d0401690
const kinobi = k.createFromJson(
  fs.readFileSync(`${__dirname}/token_2022.json`, 'utf8')
);

kinobi.accept(
  k.renderJavaScriptVisitor('./test/packages/js-token2022/src/generated', {})
);
