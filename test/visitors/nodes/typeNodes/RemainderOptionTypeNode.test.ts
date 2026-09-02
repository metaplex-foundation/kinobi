import test from 'ava';
import {
  isNode,
  publicKeyTypeNode,
  remainderOptionTypeNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = remainderOptionTypeNode(publicKeyTypeNode());

test('it builds a remainderOptionTypeNode', (t) => {
  t.deepEqual(node, {
    kind: 'remainderOptionTypeNode',
    item: publicKeyTypeNode(),
  });
  t.true(isNode(node, 'remainderOptionTypeNode'));
  t.false(isNode(node, 'optionTypeNode'));
});

test(mergeVisitorMacro, node, 2);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[remainderOptionTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[publicKeyTypeNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
remainderOptionTypeNode
|   publicKeyTypeNode`
);
