import test from 'ava';
import { fixedSizeTypeNode, isNode, stringTypeNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = fixedSizeTypeNode(stringTypeNode(), 8);

test('it builds a fixedSizeTypeNode', (t) => {
  t.deepEqual(node, {
    kind: 'fixedSizeTypeNode',
    type: stringTypeNode(),
    size: 8,
  });
  t.true(isNode(node, 'fixedSizeTypeNode'));
  t.false(isNode(node, 'stringTypeNode'));
});

test(mergeVisitorMacro, node, 4);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[fixedSizeTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[stringTypeNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
fixedSizeTypeNode [8]
|   stringTypeNode [utf8]
|   |   prefixedSizeNode
|   |   |   numberTypeNode [u32]`
);
