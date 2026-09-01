import test from 'ava';
import {
  LinkableDictionary,
  arrayTypeNode,
  bytesTypeNode,
  constantValueNode,
  fixedSizeTypeNode,
  getByteSizeVisitor,
  hiddenPrefixTypeNode,
  numberTypeNode,
  numberValueNode,
  preOffsetTypeNode,
  publicKeyTypeNode,
  remainderOptionTypeNode,
  remainderSizeNode,
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

test('it wraps a preOffsetTypeNode (padded strategy) with the padLeftSerializer serializer', (t) => {
  // Given a preOffsetTypeNode wrapping a u8, with the 'padded' strategy and
  // an 83-byte offset (as in Token-2022's hidden discriminator prefix).
  const node = preOffsetTypeNode(numberTypeNode('u8'), 83, 'padded');

  // When we visit it with the type manifest visitor.
  const manifest = visit(node, createTypeManifestVisitor());

  // Then the serializer wraps the child serializer with padLeftSerializer(...).
  codeContains(t, manifest.serializer, 'padLeftSerializer(u8(), 83)');
});

test('it registers padLeftSerializer in the sharedSerializers set when visited', (t) => {
  // Given a sharedSerializers set that starts out empty.
  const sharedSerializers = new Set<string>();
  t.false(sharedSerializers.has('padLeftSerializer'));

  // When we visit a preOffsetTypeNode (padded strategy) with that set threaded in.
  const node = preOffsetTypeNode(numberTypeNode('u8'), 83, 'padded');
  visit(node, createTypeManifestVisitor(sharedSerializers));

  // Then the set now contains 'padLeftSerializer'.
  t.true(sharedSerializers.has('padLeftSerializer'));
});

test('it does not touch sharedSerializers for preOffset when the set is not provided', (t) => {
  // Given a preOffsetTypeNode (padded strategy) and a visitor with no
  // sharedSerializers threaded in.
  const node = preOffsetTypeNode(numberTypeNode('u8'), 83, 'padded');

  // When / then visiting it must not throw despite `sharedSerializers` being undefined.
  t.notThrows(() => visit(node, createTypeManifestVisitor(undefined)));
});

test('it throws when a preOffsetTypeNode uses a non-padded strategy', (t) => {
  // Given a preOffsetTypeNode using the 'relative' strategy, which the
  // JavaScript renderer does not support.
  const relativeNode = preOffsetTypeNode(numberTypeNode('u8'), 4, 'relative');
  t.throws(() => visit(relativeNode, createTypeManifestVisitor()), {
    message: /padded/,
  });

  // Same for the 'absolute' strategy.
  const absoluteNode = preOffsetTypeNode(numberTypeNode('u8'), 4, 'absolute');
  t.throws(() => visit(absoluteNode, createTypeManifestVisitor()), {
    message: /padded/,
  });
});

test('it wraps a hiddenPrefixTypeNode with the hiddenPrefix serializer, rendering each constant inline', (t) => {
  // Given a hiddenPrefixTypeNode wrapping a u8, with a single u8 constant prefix.
  const node = hiddenPrefixTypeNode(numberTypeNode('u8'), [
    constantValueNode(numberTypeNode('u8'), numberValueNode(1)),
  ]);

  // When we visit it with the type manifest visitor.
  const manifest = visit(node, createTypeManifestVisitor());

  // Then the serializer wraps the child serializer with hiddenPrefix(...),
  // and the constant is rendered inline as `<serializer>.serialize(<value>)`.
  codeContains(t, manifest.serializer, 'hiddenPrefix(u8(), [u8().serialize(1)])');
});

test('it registers hiddenPrefix in the sharedSerializers set when visited', (t) => {
  // Given a sharedSerializers set that starts out empty.
  const sharedSerializers = new Set<string>();
  t.false(sharedSerializers.has('hiddenPrefix'));

  // When we visit a hiddenPrefixTypeNode with that set threaded in.
  const node = hiddenPrefixTypeNode(numberTypeNode('u8'), [
    constantValueNode(numberTypeNode('u8'), numberValueNode(1)),
  ]);
  visit(node, createTypeManifestVisitor(sharedSerializers));

  // Then the set now contains 'hiddenPrefix'.
  t.true(sharedSerializers.has('hiddenPrefix'));
});

test('it does not touch sharedSerializers for hiddenPrefix when the set is not provided', (t) => {
  // Given a hiddenPrefixTypeNode and a visitor with no sharedSerializers threaded in.
  const node = hiddenPrefixTypeNode(numberTypeNode('u8'), [
    constantValueNode(numberTypeNode('u8'), numberValueNode(1)),
  ]);

  // When / then visiting it must not throw despite `sharedSerializers` being undefined.
  t.notThrows(() => visit(node, createTypeManifestVisitor(undefined)));
});

test('it renders the composite Token-2022 hiddenPrefix(remainder array, preOffset constant) shape', (t) => {
  // Given the exact Token-2022 extension-list shape: a hiddenPrefixTypeNode
  // wrapping a remainder-sized array of u8 extensions, with a single prefix
  // constant whose *type* is itself a preOffsetTypeNode (an 83-byte padded
  // u8 discriminator, encoding the value 1). This must serialize to 83 zero
  // bytes followed by 0x01 (84 bytes total).
  const node = hiddenPrefixTypeNode(
    arrayTypeNode(numberTypeNode('u8'), remainderSizeNode()),
    [
      constantValueNode(
        preOffsetTypeNode(numberTypeNode('u8'), 83, 'padded'),
        numberValueNode(1)
      ),
    ]
  );

  // When we visit it with the type manifest visitor.
  const manifest = visit(node, createTypeManifestVisitor());

  // Then the constant's own type (preOffsetTypeNode) is rendered as a nested
  // padLeftSerializer(...), whose result is then used to serialize the
  // constant's value (1) inline, all nested inside the outer hiddenPrefix(...).
  codeContains(
    t,
    manifest.serializer,
    'hiddenPrefix(array(u8(), { size: \'remainder\' }), [padLeftSerializer(u8(), 83).serialize(1)])'
  );
});
