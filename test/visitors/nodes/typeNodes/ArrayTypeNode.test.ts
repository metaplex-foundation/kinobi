import test from 'ava';
import {
  arrayTypeNode,
  numberTypeNode,
  prefixedSizeNode,
  publicKeyTypeNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = arrayTypeNode(
  publicKeyTypeNode(),
  prefixedSizeNode(numberTypeNode('u64'))
);

test(mergeVisitorMacro, node, 4);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[arrayTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[publicKeyTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[prefixedSizeNode]', null);
test(deleteNodesVisitorMacro, node, '[numberTypeNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
arrayTypeNode
|   prefixedSizeNode
|   |   numberTypeNode [u64]
|   publicKeyTypeNode`
);
