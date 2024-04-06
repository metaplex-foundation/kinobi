import test from 'ava';
import {
  fixedSizeTypeNode,
  mapTypeNode,
  numberTypeNode,
  prefixedCountNode,
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
  fixedSizeTypeNode(stringTypeNode(), 32),
  publicKeyTypeNode(),
  prefixedCountNode(numberTypeNode('u8'))
);

test(mergeVisitorMacro, node, 6);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[mapTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[stringTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[publicKeyTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[prefixedCountNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
 mapTypeNode
|   prefixedCountNode
|   |   numberTypeNode [u8]
|   fixedSizeTypeNode [32]
|   |   stringTypeNode [utf8]
|   publicKeyTypeNode`
);
