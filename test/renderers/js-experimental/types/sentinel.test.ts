import test from 'ava';
import {
  constantValueNodeFromBytes,
  definedTypeNode,
  sentinelTypeNode,
  stringTypeNode,
  visit,
} from '../../../../src';
import { getRenderMapVisitor } from '../../../../src/renderers/js-experimental/getRenderMapVisitor';
import { renderMapContains, renderMapContainsImports } from '../_setup';

test('it renders sentinel codecs', (t) => {
  // Given the following node.
  const node = definedTypeNode({
    name: 'myType',
    type: sentinelTypeNode(
      stringTypeNode('utf8'),
      constantValueNodeFromBytes('base16', 'ff')
    ),
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the following types and codecs to be exported.
  renderMapContains(t, renderMap, 'types/myType.ts', [
    'export type MyType = string',
    'addEncoderSentinel( getUtf8Encoder() , new Uint8Array([ 255 ]) )',
    'addDecoderSentinel( getUtf8Decoder() ,  new Uint8Array([ 255 ]) )',
  ]);

  // And we expect the following codec imports.
  renderMapContainsImports(t, renderMap, 'types/myType.ts', {
    '@solana/codecs': ['addEncoderSentinel', 'addDecoderSentinel'],
  });
});
