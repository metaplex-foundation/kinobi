import test from 'ava';
import {
  numberTypeNode,
  publicKeyTypeNode,
  tupleTypeNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = tupleTypeNode([publicKeyTypeNode(), numberTypeNode('u64')]);

test(mergeVisitorMacro, node, 3);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[tupleTypeNode]', null);
test(
  deleteNodesVisitorMacro,
  node,
  ['[publicKeyTypeNode]', '[numberTypeNode]'],
  { ...node, items: [] }
);
test(
  getDebugStringVisitorMacro,
  node,
  `
tupleTypeNode
|   publicKeyTypeNode
|   numberTypeNode [u64]`
);
