import test from 'ava';
import {
  constantValueNodeFromBytes,
  definedTypeNode,
  numberTypeNode,
  publicKeyTypeNode,
  visit,
  zeroableOptionTypeNode,
} from '../../../../src';
import { getRenderMapVisitor } from '../../../../src/renderers/js/getRenderMapVisitor';
import { renderMapContains, renderMapContainsImports } from '../_setup';

test('it renders zeroable option serializers', (t) => {
  // Given the following node.
  const node = definedTypeNode({
    name: 'myType',
    type: zeroableOptionTypeNode(publicKeyTypeNode()),
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then we expect the following types and serializer.
  renderMapContains(t, renderMap, 'types/myType.ts', [
    'export type MyType = Option<PublicKey>',
    'export type MyTypeArgs = OptionOrNullable<PublicKey>',
    'zeroableOption( publicKeySerializer() )',
  ]);

  // And we expect the following imports.
  renderMapContainsImports(t, renderMap, 'types/myType.ts', {
    '../shared': ['zeroableOption'],
    '@metaplex-foundation/umi': ['Option', 'OptionOrNullable'],
  });
});

test('it renders zeroable option serializers with custom zero values', (t) => {
  // Given the following node.
  const node = definedTypeNode({
    name: 'myType',
    type: zeroableOptionTypeNode(
      numberTypeNode('u16'),
      constantValueNodeFromBytes('base16', 'ffff')
    ),
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the zero value is rendered as a byte array option.
  renderMapContains(t, renderMap, 'types/myType.ts', [
    'zeroableOption( u16() , { zeroValue: new Uint8Array([ 255, 255 ]) } )',
  ]);
});
