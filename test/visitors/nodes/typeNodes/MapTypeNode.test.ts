import test from 'ava';
import {
  fixedSizeNode,
  mapTypeNode,
  numberTypeNode,
  prefixedSizeNode,
  publicKeyTypeNode,
  stringTypeNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = mapTypeNode(
  stringTypeNode({ size: fixedSizeNode(32) }),
  publicKeyTypeNode(),
  prefixedSizeNode(numberTypeNode('u8'))
);

test(mergeVisitorMacro, node, 6);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[mapTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[stringTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[publicKeyTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[prefixedSizeNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
 mapTypeNode
|   prefixedSizeNode
|   |   numberTypeNode [u8]
|   stringTypeNode [utf8]
|   |   fixedSizeNode [32]
|   publicKeyTypeNode`
);
