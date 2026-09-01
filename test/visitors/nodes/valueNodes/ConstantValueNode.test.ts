import test from 'ava';
import {
  constantValueNode,
  isNode,
  numberTypeNode,
  numberValueNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = constantValueNode(numberTypeNode('u8'), numberValueNode(1));

test('it builds a constantValueNode', (t) => {
  t.deepEqual(node, {
    kind: 'constantValueNode',
    type: numberTypeNode('u8'),
    value: numberValueNode(1),
  });
  t.true(isNode(node, 'constantValueNode'));
  t.false(isNode(node, 'someValueNode'));
});

test(mergeVisitorMacro, node, 3);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[constantValueNode]', null);
test(deleteNodesVisitorMacro, node, '[numberTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[numberValueNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
constantValueNode
|   numberTypeNode [u8]
|   numberValueNode [1]`
);
