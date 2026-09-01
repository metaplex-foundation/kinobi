import test from 'ava';
import {
  definedTypeNode,
  publicKeyTypeNode,
  remainderOptionTypeNode,
  visit,
} from '../../../../src';
import { getRenderMapVisitor } from '../../../../src/renderers/js-experimental/getRenderMapVisitor';
import { renderMapContains, renderMapContainsImports } from '../_setup';

test('it renders remainder option codecs', (t) => {
  // Given the following node.
  const node = definedTypeNode({
    name: 'myType',
    type: remainderOptionTypeNode(publicKeyTypeNode()),
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect prefix-less option codecs.
  renderMapContains(t, renderMap, 'types/myType.ts', [
    'export type MyType = Option<Address>',
    'export type MyTypeArgs = OptionOrNullable<Address>',
    'getOptionEncoder( getAddressEncoder() , { prefix: null } )',
    'getOptionDecoder( getAddressDecoder() , { prefix: null } )',
  ]);

  // And we expect the following imports.
  renderMapContainsImports(t, renderMap, 'types/myType.ts', {
    '@solana/web3.js': ['getOptionEncoder', 'getOptionDecoder'],
  });
});
