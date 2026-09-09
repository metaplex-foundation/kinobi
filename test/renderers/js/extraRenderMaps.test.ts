import test from 'ava';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  RenderMap,
  programNode,
  renderJavaScriptVisitor,
  rootNode,
  rootNodeVisitor,
  visit,
} from '../../../src';

test('it writes extra render maps alongside the generated client', (t) => {
  // Given a root node and an extra render map visitor.
  const node = rootNode(programNode({ name: 'myProgram', publicKey: '1111' }));
  const extra = rootNodeVisitor((root) =>
    new RenderMap().add(
      'plugins/index.ts',
      `export const program = '${root.program.name}';`
    )
  );
  const dir = mkdtempSync(join(tmpdir(), 'kinobi-extra-'));

  try {
    // When we render the JavaScript client with that extra render map.
    visit(node, renderJavaScriptVisitor(dir, { extraRenderMaps: [extra] }));

    // Then the generated client and the extra file are both written.
    t.true(existsSync(join(dir, 'index.ts')));
    t.is(
      readFileSync(join(dir, 'plugins/index.ts'), 'utf8'),
      "export const program = 'myProgram';"
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
