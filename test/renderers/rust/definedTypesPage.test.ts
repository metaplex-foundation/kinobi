import test from 'ava';
import {
  definedTypeNode,
  numberTypeNode,
  prefixedSizeNode,
  programNode,
  stringTypeNode,
  structFieldTypeNode,
  structTypeNode,
  visit,
} from '../../../src';
import { getRenderMapVisitor } from '../../../src/renderers/rust/getRenderMapVisitor';
import { codeContains } from './_setup';

test('it renders a prefix string on a defined type', (t) => {
  // Given the following program with 1 defined type using a prefixed size string.
  const node = programNode({
    name: 'splToken',
    publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    definedTypes: [
      definedTypeNode({
        name: 'blob',
        type: structTypeNode([
          structFieldTypeNode({
            name: 'contentType',
            type: stringTypeNode({
              size: prefixedSizeNode(numberTypeNode('u8')),
            }),
          }),
        ]),
      }),
    ],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the following use and identifier to be rendered.
  codeContains(t, renderMap.get('types/blob.rs'), [
    `use kaigan::types::U8PrefixString;`,
    `content_type: U8PrefixString,`,
  ]);
});
