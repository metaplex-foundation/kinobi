import test from 'ava';
import {
  constantValueNodeFromBytes,
  definedTypeNode,
  numberTypeNode,
  postOffsetTypeNode,
  preOffsetTypeNode,
  sentinelTypeNode,
  stringTypeNode,
  visit,
} from '../../../../src';
import { getRenderMapVisitor } from '../../../../src/renderers/js/getRenderMapVisitor';
import { renderMapContains } from '../_setup';

test('it renders padded pre offset serializers', (t) => {
  const node = definedTypeNode({
    name: 'myType',
    type: preOffsetTypeNode(numberTypeNode('u8'), 4, 'padded'),
  });
  const renderMap = visit(node, getRenderMapVisitor());
  renderMapContains(t, renderMap, 'types/myType.ts', [
    'padLeftSerializer( u8() , 4 )',
  ]);
});

test('it renders padded post offset serializers', (t) => {
  const node = definedTypeNode({
    name: 'myType',
    type: postOffsetTypeNode(numberTypeNode('u8'), 4, 'padded'),
  });
  const renderMap = visit(node, getRenderMapVisitor());
  renderMapContains(t, renderMap, 'types/myType.ts', [
    'padRightSerializer( u8() , 4 )',
  ]);
});

test('it throws on non-padded offset strategies', (t) => {
  const node = definedTypeNode({
    name: 'myType',
    type: preOffsetTypeNode(numberTypeNode('u8'), 4, 'relative'),
  });
  t.throws(() => visit(node, getRenderMapVisitor()), { message: /padded/ });
});

test('it throws on sentinel types', (t) => {
  const node = definedTypeNode({
    name: 'myType',
    type: sentinelTypeNode(
      stringTypeNode('utf8'),
      constantValueNodeFromBytes('base16', 'ff')
    ),
  });
  t.throws(() => visit(node, getRenderMapVisitor()), { message: /sentinel/i });
});
