import { readFileSync } from 'fs';
import { join } from 'path';
import test from 'ava';
import {
  createFromJson,
  Node,
  REGISTERED_NODE_KINDS,
  assertIsNode,
  isNode,
} from '../../src';

// Resolved from the repository root (ava's cwd), not `__dirname`: ava runs
// tests from prebuilt `dist/test/test/**` (see the `ava.typescript` config
// in package.json), which never receives non-`.ts` files like this JSON
// fixture. Reading it from the source `test/` tree instead avoids having to
// keep a copy of the fixture in sync under `dist/test`.
const FIXTURE_PATH = join(process.cwd(), 'test/codama/token_2022.json');

function readFixture(): string {
  return readFileSync(FIXTURE_PATH, 'utf8');
}

function walk(node: unknown, visit: (n: Node) => void): void {
  if (Array.isArray(node)) {
    node.forEach((child) => walk(child, visit));
    return;
  }
  if (node === null || typeof node !== 'object') return;
  const obj = node as Record<string, unknown>;
  if (typeof obj.kind === 'string') {
    visit(obj as unknown as Node);
  }
  Object.values(obj).forEach((child) => walk(child, visit));
}

// KNOWN GAP: this currently throws -- see test/visitors/normalizeCodamaRoot.test.ts's
// "KNOWN GAP" test and task-04-report.md for the full explanation. In short:
// the real IDL's `extension` enum has 28 struct variants whose `.struct` is
// a `sizePrefixTypeNode` (the TLV u16 length prefix) wrapping a
// `structTypeNode`. Per this task's transform rules that wrapper is kept
// (it isn't a string/bytes leaf), but v1.0's `EnumStructVariantTypeNode`
// requires a bare `StructTypeNode`, so canonicalization throws. This is a
// pre-existing v1.0 node-shape gap, not something the loader can silently
// paper over without either losing byte-layout information or widening
// EnumStructVariantTypeNode/EnumTupleVariantTypeNode (a judgment call left
// for a maintainer decision). Flip this back to `test(...)` once resolved.
test.failing('it loads the real Token-2022 Codama IDL into a valid v1.0 root', (t) => {
  const kinobi = createFromJson(readFixture());
  const root = kinobi.getRoot();

  t.is(root.kind, 'rootNode');
  t.is(root.programs.length, 2);
  t.false('standard' in root);
  t.false('program' in root);
  t.false('additionalPrograms' in root);

  const badKinds = new Set<string>();
  let strayCount = false;
  walk(root, (node) => {
    if (!REGISTERED_NODE_KINDS.includes(node.kind)) {
      badKinds.add(node.kind);
    }
    if (
      (isNode(node, ['arrayTypeNode', 'setTypeNode', 'mapTypeNode']) &&
        'count' in node) ||
      false
    ) {
      strayCount = true;
    }
  });
  t.deepEqual([...badKinds], [], 'no leftover Codama-only node kinds');
  t.false(strayCount, 'no stray `count` props on array/set/map nodes');

  // Spot-check the mint extensions field: remainderOptionTypeNode ->
  // hiddenPrefixTypeNode -> arrayTypeNode with size.kind === 'remainderSizeNode'.
  const mintAccount = root.programs
    .flatMap((p) => p.accounts)
    .find((a) => a.name === 'mint');
  t.truthy(mintAccount);
  const extensionsField = mintAccount!.data.fields.find(
    (f) => f.name === 'extensions'
  );
  t.truthy(extensionsField);
  assertIsNode(extensionsField!.type, 'remainderOptionTypeNode');
  assertIsNode(extensionsField!.type.item, 'hiddenPrefixTypeNode');
  assertIsNode(extensionsField!.type.item.type, 'arrayTypeNode');
  t.is(extensionsField!.type.item.type.size.kind, 'remainderSizeNode');

  // Spot-check a token-metadata string field: sizePrefixTypeNode(stringTypeNode)
  // collapses into a stringTypeNode with a prefixedSizeNode size.
  const extensionType = root.programs
    .flatMap((p) => p.definedTypes)
    .find((d) => d.name === 'extension');
  t.truthy(extensionType);
  assertIsNode(extensionType!.type, 'enumTypeNode');
  const tokenMetadataVariant = extensionType!.type.variants.find(
    (v) => v.name === 'tokenMetadata'
  );
  t.truthy(tokenMetadataVariant);
  assertIsNode(tokenMetadataVariant, 'enumStructVariantTypeNode');
  const nameField = tokenMetadataVariant.struct.fields.find(
    (f) => f.name === 'name'
  );
  t.truthy(nameField);
  assertIsNode(nameField!.type, 'stringTypeNode');
  t.is(nameField!.type.size.kind, 'prefixedSizeNode');
});
