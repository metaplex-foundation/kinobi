// Renders the Token-2022 Codama IDL into ./src using the BUILT kinobi
// (../../../dist/cjs). This mirrors how ../../testFile.cjs renders the
// other fixture packages, but lives in this package so it can run as an
// isolated `pnpm install && node generate.cjs && pnpm build && pnpm test`
// step (see the root `test:js-token2022` script). The generated `src/` is
// gitignored -- it is not committed, only regenerated on demand.
const { readFileSync } = require('fs');
const { join } = require('path');
const k = require('../../../dist/cjs/index.js');

const idlPath = join(__dirname, '..', '..', 'codama', 'token_2022.json');
const kinobi = k.createFromJson(readFileSync(idlPath, 'utf8'));

kinobi.accept(
  k.renderJavaScriptVisitor(join(__dirname, 'src'), {
    deleteFolderBeforeRendering: true,
  })
);
