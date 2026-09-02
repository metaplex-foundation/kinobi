import test from 'ava';
import {
  constantValueNode,
  isNode,
  numberTypeNode,
  numberValueNode,
  publicKeyTypeNode,
  zeroableOptionTypeNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = zeroableOptionTypeNode(
  publicKeyTypeNode(),
  constantValueNode(numberTypeNode('u8'), numberValueNode(0))
);

test('it builds a zeroableOptionTypeNode', (t) => {
  t.deepEqual(node, {
    kind: 'zeroableOptionTypeNode',
    item: publicKeyTypeNode(),
    zeroValue: constantValueNode(numberTypeNode('u8'), numberValueNode(0)),
  });
  t.true(isNode(node, 'zeroableOptionTypeNode'));
  t.false(isNode(node, 'optionTypeNode'));
});

test('it builds a zeroableOptionTypeNode without a zeroValue', (t) => {
  const nodeWithoutZeroValue = zeroableOptionTypeNode(publicKeyTypeNode());
  t.deepEqual(nodeWithoutZeroValue, {
    kind: 'zeroableOptionTypeNode',
    item: publicKeyTypeNode(),
    zeroValue: undefined,
  });
});

test(mergeVisitorMacro, node, 5);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[zeroableOptionTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[publicKeyTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[constantValueNode]', {
  ...node,
  zeroValue: undefined,
});
test(
  getDebugStringVisitorMacro,
  node,
  `
zeroableOptionTypeNode
|   publicKeyTypeNode
|   constantValueNode
|   |   numberTypeNode [u8]
|   |   numberValueNode [0]`
);
