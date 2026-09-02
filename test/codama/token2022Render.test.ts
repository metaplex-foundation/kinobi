import { readFileSync } from 'fs';
import { join } from 'path';
import test from 'ava';
import { createFromJson, throwValidatorItemsVisitor, visit } from '../../src';
import { getRenderMapVisitor } from '../../src/renderers/js/getRenderMapVisitor';
import { getValidatorBagVisitor } from '../../src/renderers/js/getValidatorBagVisitor';

// Resolved from the repository root (ava's cwd), not `__dirname` -- see the
// comment in `token2022.test.ts` for why.
const FIXTURE_PATH = join(process.cwd(), 'test/codama/token_2022.json');

function readFixture(): string {
  return readFileSync(FIXTURE_PATH, 'utf8');
}

// This is the same validate-then-render pipeline `renderJavaScriptVisitor`
// runs, minus the disk-writing step (`deleteFolder`/`writeRenderMapVisitor`)
// so the test stays hermetic and fast. It exercises the full JS render --
// type manifests, value defaults (including `bytesValueNode`, fixed by this
// task), instructions, accounts, and defined types -- against the real
// Token-2022 IDL.
test('it renders a full JavaScript client from the Token-2022 Codama IDL', (t) => {
  const kinobi = createFromJson(readFixture());
  const root = kinobi.getRoot();

  // Validation must pass before rendering (mirrors renderJavaScriptVisitor).
  t.notThrows(() => {
    visit(root, throwValidatorItemsVisitor(getValidatorBagVisitor()));
  });

  // The full render must not throw, and must produce a non-trivial set of
  // generated files.
  const renderMap = visit(root, getRenderMapVisitor());
  t.false(renderMap.isEmpty());

  // Spot-check a handful of expected files across each category.
  t.true(renderMap.has('accounts/mint.ts'), 'expected accounts/mint.ts');
  t.true(renderMap.has('accounts/token.ts'), 'expected accounts/token.ts');
  t.true(
    renderMap.has('types/extension.ts'),
    'expected types/extension.ts (the Token-2022 extension enum)'
  );
  t.true(
    renderMap.has('instructions/index.ts'),
    'expected instructions/index.ts'
  );
  t.true(renderMap.has('index.ts'), 'expected root index.ts');
});
