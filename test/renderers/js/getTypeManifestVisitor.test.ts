import test from 'ava';
import {
  LinkableDictionary,
  getByteSizeVisitor,
  publicKeyTypeNode,
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
