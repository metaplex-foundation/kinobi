import test from 'ava';
import {
  numberTypeNode,
  sizePrefixTypeNode,
  stringTypeNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = sizePrefixTypeNode(stringTypeNode('utf8'), numberTypeNode('u32'));

test(mergeVisitorMacro, node, 3);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[sizePrefixTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[stringTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[numberTypeNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
sizePrefixTypeNode
|   numberTypeNode [u32]
|   stringTypeNode [utf8]
`
);
