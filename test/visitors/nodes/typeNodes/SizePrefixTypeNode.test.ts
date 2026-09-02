import test from 'ava';
import {
  isNode,
  numberTypeNode,
  publicKeyTypeNode,
  sizePrefixTypeNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = sizePrefixTypeNode(publicKeyTypeNode(), numberTypeNode('u32'));

test('it builds a sizePrefixTypeNode', (t) => {
  t.deepEqual(node, {
    kind: 'sizePrefixTypeNode',
    type: publicKeyTypeNode(),
    prefix: numberTypeNode('u32'),
  });
  t.true(isNode(node, 'sizePrefixTypeNode'));
  t.false(isNode(node, 'publicKeyTypeNode'));
});

test(mergeVisitorMacro, node, 3);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[sizePrefixTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[publicKeyTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[numberTypeNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
sizePrefixTypeNode
|   publicKeyTypeNode
|   numberTypeNode [u32]`
);
