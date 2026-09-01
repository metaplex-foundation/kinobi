import test from 'ava';
import {
  LinkableDictionary,
  bytesTypeNode,
  fixedSizeTypeNode,
  getByteSizeVisitor,
  numberTypeNode,
  publicKeyTypeNode,
  remainderOptionTypeNode,
  sizePrefixTypeNode,
  stringTypeNode,
  structFieldTypeNode,
  structTypeNode,
  visit,
  zeroableOptionTypeNode,
} from '../../../src';
import { getTypeManifestVisitor } from '../../../src/renderers/js/getTypeManifestVisitor';
import { renderValueNodeVisitor } from '../../../src/renderers/js/renderValueNodeVisitor';
import { codeContains } from './_setup';

function createTypeManifestVisitor(sharedSerializers?: Set<string>) {
  const linkables = new LinkableDictionary();
  return getTypeManifestVisitor({
    valueNodeVisitor: renderValueNodeVisitor({
      linkables,
      nonScalarEnums: [],
    }),
    customAccountData: new Map(),
    customInstructionData: new Map(),
    byteSizeVisitor: getByteSizeVisitor(linkables),
    sharedSerializers,
  });
}

test('it wraps a zeroableOptionTypeNode with the zeroableOption serializer', (t) => {
  // Given a zeroableOptionTypeNode wrapping a publicKey.
  const node = zeroableOptionTypeNode(publicKeyTypeNode());

  // When we visit it with the type manifest visitor.
  const manifest = visit(node, createTypeManifestVisitor());

  // Then the serializer wraps the child serializer with zeroableOption(...).
  codeContains(t, manifest.serializer, 'zeroableOption(publicKeySerializer())');
  codeContains(t, manifest.strictType, 'Option<PublicKey>');
  codeContains(t, manifest.looseType, 'OptionOrNullable<PublicKey>');
});

test('it registers zeroableOption in the sharedSerializers set when visited', (t) => {
  // Given a sharedSerializers set that starts out empty.
  const sharedSerializers = new Set<string>();
  t.false(sharedSerializers.has('zeroableOption'));

  // When we visit a zeroableOptionTypeNode with that set threaded in.
  const node = zeroableOptionTypeNode(publicKeyTypeNode());
  visit(node, createTypeManifestVisitor(sharedSerializers));

  // Then the set now contains 'zeroableOption'.
  t.true(sharedSerializers.has('zeroableOption'));
});

test('it does not touch sharedSerializers when the set is not provided', (t) => {
  // Given a zeroableOptionTypeNode and a visitor with no sharedSerializers threaded in.
  const node = zeroableOptionTypeNode(publicKeyTypeNode());

  // When we visit it.
  // Then it must not throw despite `sharedSerializers` being undefined.
  t.notThrows(() => visit(node, createTypeManifestVisitor(undefined)));
});

test('it wraps a remainderOptionTypeNode with the remainderOption serializer', (t) => {
  // Given a remainderOptionTypeNode wrapping a u8 number.
  const node = remainderOptionTypeNode(numberTypeNode('u8'));

  // When we visit it with the type manifest visitor.
  const manifest = visit(node, createTypeManifestVisitor());

  // Then the serializer wraps the child serializer with remainderOption(...).
  codeContains(t, manifest.serializer, 'remainderOption(u8())');
  codeContains(t, manifest.strictType, 'Option<number>');
  codeContains(t, manifest.looseType, 'OptionOrNullable<number>');
});

test('it registers remainderOption in the sharedSerializers set when visited', (t) => {
  // Given a sharedSerializers set that starts out empty.
  const sharedSerializers = new Set<string>();
  t.false(sharedSerializers.has('remainderOption'));

  // When we visit a remainderOptionTypeNode with that set threaded in.
  const node = remainderOptionTypeNode(numberTypeNode('u8'));
  visit(node, createTypeManifestVisitor(sharedSerializers));

  // Then the set now contains 'remainderOption'.
  t.true(sharedSerializers.has('remainderOption'));
});

test('it does not touch sharedSerializers for remainderOption when the set is not provided', (t) => {
  // Given a remainderOptionTypeNode and a visitor with no sharedSerializers threaded in.
  const node = remainderOptionTypeNode(numberTypeNode('u8'));

  // When we visit it.
  // Then it must not throw despite `sharedSerializers` being undefined.
  t.notThrows(() => visit(node, createTypeManifestVisitor(undefined)));
});

test('it wraps a sizePrefixTypeNode (struct body) with the sizePrefix serializer', (t) => {
  // Given a sizePrefixTypeNode wrapping a struct (a TLV body), prefixed by a u16.
  const node = sizePrefixTypeNode(
    structTypeNode([
      structFieldTypeNode({ name: 'amount', type: numberTypeNode('u64') }),
    ]),
    numberTypeNode('u16')
  );

  // When we visit it with the type manifest visitor.
  const manifest = visit(node, createTypeManifestVisitor());

  // Then the serializer wraps the child struct serializer with sizePrefix(...),
  // passing the u16 number serializer as the second (prefix) argument.
  codeContains(t, manifest.serializer, 'sizePrefix(');
  // (Checked as 'u16())' rather than 'u16()' so the fragment isn't valid TS
  // on its own — otherwise prettier would auto-insert a trailing semicolon
  // when normalizing the expected string, which wouldn't match the ")" that
  // actually follows it mid-expression in the real serializer.)
  codeContains(t, manifest.serializer, 'u16())');
  // And the TS type is left untouched — a size prefix only changes the wire
  // encoding, not the shape of the decoded value.
  codeContains(t, manifest.strictType, 'amount: bigint');
});

test('it registers sizePrefix in the sharedSerializers set when visited', (t) => {
  // Given a sharedSerializers set that starts out empty.
  const sharedSerializers = new Set<string>();
  t.false(sharedSerializers.has('sizePrefix'));

  // When we visit a sizePrefixTypeNode (struct body) with that set threaded in.
  const node = sizePrefixTypeNode(
    structTypeNode([
      structFieldTypeNode({ name: 'amount', type: numberTypeNode('u64') }),
    ]),
    numberTypeNode('u16')
  );
  visit(node, createTypeManifestVisitor(sharedSerializers));

  // Then the set now contains 'sizePrefix'.
  t.true(sharedSerializers.has('sizePrefix'));
});

test('it throws when a sizePrefixTypeNode wraps a stringTypeNode', (t) => {
  // Given a sizePrefixTypeNode wrapping a stringTypeNode. On v1.0, the loader
  // collapses sizePrefixTypeNode/fixedSizeTypeNode wrappers around string/bytes
  // leaves into the leaf's native `size` property, so the renderer should never
  // see this shape. This is a defensive check: fail loud rather than silently
  // double-encoding the size.
  const node = sizePrefixTypeNode(stringTypeNode(), numberTypeNode('u32'));

  // When / then visiting it throws.
  t.throws(() => visit(node, createTypeManifestVisitor()));
});

test('it throws when a sizePrefixTypeNode wraps a bytesTypeNode', (t) => {
  // Same defensive check as above, but for a bytesTypeNode leaf.
  const node = sizePrefixTypeNode(bytesTypeNode(), numberTypeNode('u32'));

  t.throws(() => visit(node, createTypeManifestVisitor()));
});

test('it wraps a fixedSizeTypeNode (struct body) with fixSerializer', (t) => {
  // Given a fixedSizeTypeNode wrapping a struct (a TLV body) of a fixed size.
  const node = fixedSizeTypeNode(
    structTypeNode([
      structFieldTypeNode({ name: 'amount', type: numberTypeNode('u64') }),
    ]),
    8
  );

  // When we visit it with the type manifest visitor.
  const manifest = visit(node, createTypeManifestVisitor());

  // Then the serializer wraps the child struct serializer with fixSerializer(...).
  codeContains(t, manifest.serializer, 'fixSerializer(');
  codeContains(t, manifest.serializer, ', 8)');
  codeContains(
    t,
    manifest.serializerImports.toString({}),
    "import { fixSerializer"
  );
  codeContains(
    t,
    manifest.serializerImports.toString({}),
    "from '@metaplex-foundation/umi/serializers'"
  );
});

test('it does not register any shared serializer for fixedSizeTypeNode', (t) => {
  // Given a sharedSerializers set that starts out empty.
  const sharedSerializers = new Set<string>();

  // When we visit a fixedSizeTypeNode (struct body) with that set threaded in.
  const node = fixedSizeTypeNode(
    structTypeNode([
      structFieldTypeNode({ name: 'amount', type: numberTypeNode('u64') }),
    ]),
    8
  );
  visit(node, createTypeManifestVisitor(sharedSerializers));

  // Then fixSerializer is a umi/serializers export, not a shared on-demand
  // helper, so the set must remain untouched.
  t.is(sharedSerializers.size, 0);
});

test('it throws when a fixedSizeTypeNode wraps a stringTypeNode', (t) => {
  // Same defensive check as sizePrefixTypeNode: the loader should have
  // collapsed this shape away before the renderer ever sees it.
  const node = fixedSizeTypeNode(stringTypeNode(), 8);

  t.throws(() => visit(node, createTypeManifestVisitor()));
});
