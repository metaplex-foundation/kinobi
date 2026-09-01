import test from 'ava';
import {
  definedTypeNode,
  publicKeyTypeNode,
  remainderOptionTypeNode,
  visit,
} from '../../../../src';
import { getRenderMapVisitor } from '../../../../src/renderers/js/getRenderMapVisitor';
import { renderMapContains, renderMapContainsImports } from '../_setup';

test('it renders remainder option serializers', (t) => {
  // Given the following node.
  const node = definedTypeNode({
    name: 'myType',
    type: remainderOptionTypeNode(publicKeyTypeNode()),
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the following types and serializer.
  renderMapContains(t, renderMap, 'types/myType.ts', [
    'export type MyType = Option<PublicKey>',
    'export type MyTypeArgs = OptionOrNullable<PublicKey>',
    'remainderOption( publicKeySerializer() )',
  ]);

  // And we expect the following imports.
  renderMapContainsImports(t, renderMap, 'types/myType.ts', {
    '../shared': ['remainderOption'],
    '@metaplex-foundation/umi': ['Option', 'OptionOrNullable'],
  });
});
