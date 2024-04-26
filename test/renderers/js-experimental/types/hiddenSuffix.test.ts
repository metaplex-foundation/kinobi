import test from 'ava';
import {
  constantValueNodeFromBytes,
  constantValueNodeFromString,
  definedTypeNode,
  hiddenSuffixTypeNode,
  numberTypeNode,
  visit,
} from '../../../../src';
import { getRenderMapVisitor } from '../../../../src/renderers/js-experimental/getRenderMapVisitor';
import { renderMapContains, renderMapContainsImports } from '../_setup';

test('it renders hidden suffix codecs', (t) => {
  // Given the following node.
  const node = definedTypeNode({
    name: 'myType',
    type: hiddenSuffixTypeNode(numberTypeNode('u32'), [
      constantValueNodeFromString('utf8', 'hello world'),
      constantValueNodeFromBytes('base16', 'ff'),
    ]),
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the following types and codecs to be exported.
  renderMapContains(t, renderMap, 'types/myType.ts', [
    'export type MyType = number',
    "getHiddenSuffixEncoder( getU32Encoder() , [ getConstantEncoder( getUtf8Encoder().encode('hello world') ), getConstantEncoder( new Uint8Array([ 255 ]) ) ] )",
    "getHiddenSuffixDecoder( getU32Decoder() , [ getConstantDecoder( getUtf8Encoder().encode('hello world') ), getConstantDecoder( new Uint8Array([ 255 ]) ) ] )",
  ]);

  // And we expect the following codec imports.
  renderMapContainsImports(t, renderMap, 'types/myType.ts', {
    '@solana/web3.js': [
      'getHiddenSuffixEncoder',
      'getHiddenSuffixDecoder',
      'getConstantEncoder',
      'getConstantDecoder',
      'getUtf8Encoder',
    ],
  });
});
