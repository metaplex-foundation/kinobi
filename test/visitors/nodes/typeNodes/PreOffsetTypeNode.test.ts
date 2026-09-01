import test from 'ava';
import { isNode, numberTypeNode, preOffsetTypeNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = preOffsetTypeNode(numberTypeNode('u8'), 83, 'padded');

test('it builds a preOffsetTypeNode', (t) => {
  t.deepEqual(node, {
    kind: 'preOffsetTypeNode',
    type: numberTypeNode('u8'),
    offset: 83,
    strategy: 'padded',
  });
  t.true(isNode(node, 'preOffsetTypeNode'));
  t.false(isNode(node, 'numberTypeNode'));
});

test('it defaults the strategy to relative', (t) => {
  const defaultNode = preOffsetTypeNode(numberTypeNode('u8'), 4);
  t.is(defaultNode.strategy, 'relative');
});

test(mergeVisitorMacro, node, 2);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[preOffsetTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[numberTypeNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
preOffsetTypeNode
|   numberTypeNode [u8]`
);
