import test from 'ava';
import {
  definedTypeNode,
  fixedSizeTypeNode,
  stringTypeNode,
  visit,
} from '../../../../src';
import { getRenderMapVisitor } from '../../../../src/renderers/js-experimental/getRenderMapVisitor';
import { renderMapContains } from '../_setup';

test('it renders fixed size codecs', (t) => {
  // Given the following node.
  const node = definedTypeNode({
    name: 'myType',
    type: fixedSizeTypeNode(stringTypeNode('utf8'), 10),
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the following types and codecs to be exported.
  renderMapContains(t, renderMap, 'types/myType.ts', [
    'export type MyType = string',
    'fixEncoderSize( getUtf8Encoder() , 10 )',
    'fixDecoderSize( getUtf8Decoder() , 10 )',
  ]);
});
