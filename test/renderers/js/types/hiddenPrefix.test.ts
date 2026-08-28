import test from 'ava';
import {
  arrayTypeNode,
  constantValueNode,
  constantValueNodeFromBytes,
  definedTypeNode,
  hiddenPrefixTypeNode,
  numberTypeNode,
  numberValueNode,
  preOffsetTypeNode,
  publicKeyTypeNode,
  remainderCountNode,
  remainderOptionTypeNode,
  visit,
} from '../../../../src';
import { getRenderMapVisitor } from '../../../../src/renderers/js/getRenderMapVisitor';
import { renderMapContains, renderMapContainsImports } from '../_setup';

test('it renders hidden prefix serializers', (t) => {
  // Given the following node.
  const node = definedTypeNode({
    name: 'myType',
    type: hiddenPrefixTypeNode(numberTypeNode('u32'), [
      constantValueNodeFromBytes('base16', 'ff02'),
    ]),
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the constant prefix is inlined as bytes.
  renderMapContains(t, renderMap, 'types/myType.ts', [
    'export type MyType = number',
    'hiddenPrefix( u32() , [ new Uint8Array([ 255, 2 ]) ] )',
  ]);
  renderMapContainsImports(t, renderMap, 'types/myType.ts', {
    '../shared': ['hiddenPrefix'],
  });
});

test('it renders the token-2022 mint extensions shape', (t) => {
  // Given the exact wrapper nesting used by the Token-2022 mint account.
  const node = definedTypeNode({
    name: 'myType',
    type: remainderOptionTypeNode(
      hiddenPrefixTypeNode(
        arrayTypeNode(publicKeyTypeNode(), remainderCountNode()),
        [
          constantValueNode(
            preOffsetTypeNode(numberTypeNode('u8'), 83, 'padded'),
            numberValueNode(1)
          ),
        ]
      )
    ),
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then all wrappers compose.
  renderMapContains(t, renderMap, 'types/myType.ts', [
    "remainderOption( hiddenPrefix( array( publicKeySerializer() , { size: 'remainder' } ) , [ padLeftSerializer( u8() , 83 ).serialize( 1 ) ] ) )",
  ]);
  renderMapContainsImports(t, renderMap, 'types/myType.ts', {
    '../shared': ['remainderOption', 'hiddenPrefix', 'padLeftSerializer'],
  });
});
