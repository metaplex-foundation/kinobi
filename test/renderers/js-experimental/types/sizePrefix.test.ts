import test from 'ava';
import {
  definedTypeNode,
  numberTypeNode,
  sizePrefixTypeNode,
  stringTypeNode,
  visit,
} from '../../../../src';
import { getRenderMapVisitor } from '../../../../src/renderers/js-experimental/getRenderMapVisitor';
import { renderMapContains, renderMapContainsImports } from '../_setup';

test('it renders size prefix codecs', (t) => {
  // Given the following node.
  const node = definedTypeNode({
    name: 'myType',
    type: sizePrefixTypeNode(stringTypeNode('utf8'), numberTypeNode('u32')),
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the following types and codecs to be exported.
  renderMapContains(t, renderMap, 'types/myType.ts', [
    'export type MyType = string',
    'addEncoderSizePrefix( getUtf8Encoder() , getU32Encoder() )',
    'addDecoderSizePrefix( getUtf8Decoder() , getU32Decoder() )',
  ]);

  // And we expect the following codec imports.
  renderMapContainsImports(t, renderMap, 'types/myType.ts', {
    '@solana/web3.js': ['addEncoderSizePrefix', 'addDecoderSizePrefix'],
  });
});
