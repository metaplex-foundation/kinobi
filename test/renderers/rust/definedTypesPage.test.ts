import test from 'ava';
import {
  definedTypeNode,
  numberTypeNode,
  programNode,
  sizePrefixTypeNode,
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
            type: sizePrefixTypeNode(
              stringTypeNode('utf8'),
              numberTypeNode('u8')
            ),
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

test('it does not derive Eq for a defined type containing an f64 field', (t) => {
  // Given a defined type with an f64 field. f32/f64 don't implement Eq, so
  // deriving it would fail to compile.
  const node = programNode({
    name: 'splToken',
    publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    definedTypes: [
      definedTypeNode({
        name: 'liquidationBalances',
        type: structTypeNode([
          structFieldTypeNode({
            name: 'ratio',
            type: numberTypeNode('f64'),
          }),
        ]),
      }),
    ],
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());
  const code = renderMap.get('types/liquidation_balances.rs');

  // Then the struct still derives PartialEq (f64 has that), but not Eq.
  codeContains(t, code, [`pub ratio: f64,`, `PartialEq`]);
  t.false(
    /derive\([^)]*\bEq\b/.test(code!),
    'A struct containing an f64 field must not derive Eq'
  );
});
