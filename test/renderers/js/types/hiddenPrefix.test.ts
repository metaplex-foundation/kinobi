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
  stringTypeNode,
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

test('it renders a remainder-counted array of variable-size items using remainderArray', (t) => {
  // Given a remainder-counted array whose item is variable-size (unlike
  // the fixed-size publicKeyTypeNode case above). This is the shape of
  // Token-2022's account extensions TLV list once the item is swapped for
  // its real `extension` data enum, whose variants have different byte
  // lengths. umi's `array(item, { size: 'remainder' })` can only compute
  // how many items fit in the remaining bytes when the item is
  // fixed-size, so this shape must render with the `remainderArray`
  // helper instead, which decodes items one after another until the
  // buffer is exhausted.
  const node = definedTypeNode({
    name: 'myType',
    type: arrayTypeNode(stringTypeNode('utf8'), remainderCountNode()),
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then it uses remainderArray instead of array(..., { size: 'remainder' }).
  renderMapContains(t, renderMap, 'types/myType.ts', [
    "remainderArray( string( { size: 'variable' } ) )",
  ]);
  renderMapContainsImports(t, renderMap, 'types/myType.ts', {
    '../shared': ['remainderArray'],
  });
});
