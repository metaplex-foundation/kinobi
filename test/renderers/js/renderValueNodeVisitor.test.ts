import test from 'ava';
import { LinkableDictionary, bytesValueNode, visit } from '../../../src';
import { renderValueNodeVisitor } from '../../../src/renderers/js/renderValueNodeVisitor';

function createValueNodeVisitor() {
  return renderValueNodeVisitor({
    linkables: new LinkableDictionary(),
    nonScalarEnums: [],
  });
}

test('it renders a bytesValueNode as a Uint8Array literal (base16)', (t) => {
  // Given a bytesValueNode encoding the bytes [1, 2, 3] as base16.
  const node = bytesValueNode('base16', '010203');

  // When we visit it with the value node visitor.
  const { imports, render } = visit(node, createValueNodeVisitor());

  // Then we get a Uint8Array literal with no imports.
  t.is(render, 'new Uint8Array([1, 2, 3])');
  t.true(imports.isEmpty());
});

test('it renders a bytesValueNode as a Uint8Array literal (utf8)', (t) => {
  // Given a bytesValueNode encoding the string "hi" as utf8.
  const node = bytesValueNode('utf8', 'hi');

  // When we visit it with the value node visitor.
  const { imports, render } = visit(node, createValueNodeVisitor());

  // Then we get a Uint8Array literal matching the utf8 bytes of "hi".
  t.is(render, 'new Uint8Array([104, 105])');
  t.true(imports.isEmpty());
});

test('it renders an empty bytesValueNode as an empty Uint8Array literal', (t) => {
  // Given a bytesValueNode with no bytes.
  const node = bytesValueNode('base16', '');

  // When we visit it with the value node visitor.
  const { imports, render } = visit(node, createValueNodeVisitor());

  // Then we get an empty Uint8Array literal.
  t.is(render, 'new Uint8Array([])');
  t.true(imports.isEmpty());
});
