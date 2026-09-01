import test from 'ava';
import {
  constantValueNode,
  hiddenPrefixTypeNode,
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

const node = hiddenPrefixTypeNode(numberTypeNode('u8'), [
  constantValueNode(numberTypeNode('u8'), numberValueNode(1)),
]);

test('it builds a hiddenPrefixTypeNode', (t) => {
  t.deepEqual(node, {
    kind: 'hiddenPrefixTypeNode',
    type: numberTypeNode('u8'),
    prefix: [constantValueNode(numberTypeNode('u8'), numberValueNode(1))],
  });
  t.true(isNode(node, 'hiddenPrefixTypeNode'));
  t.false(isNode(node, 'numberTypeNode'));
});

test(mergeVisitorMacro, node, 5);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[hiddenPrefixTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[numberTypeNode]', null);

// A hiddenPrefixTypeNode whose prefix collapses to an empty array (e.g. all
// of its constant values were deleted) is not a meaningful wrapper on its
// own — the visitor unwraps it back to the bare inner `type` node instead of
// producing a `hiddenPrefixTypeNode` with an empty `prefix` or returning
// `null`.
test(
  deleteNodesVisitorMacro,
  node,
  '[constantValueNode]',
  numberTypeNode('u8')
);

test(
  getDebugStringVisitorMacro,
  node,
  `
hiddenPrefixTypeNode
|   constantValueNode
|   |   numberTypeNode [u8]
|   |   numberValueNode [1]
|   numberTypeNode [u8]`
);
