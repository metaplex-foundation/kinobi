import test from 'ava';
import {
  numberTypeNode,
  optionTypeNode,
  publicKeyTypeNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = optionTypeNode(publicKeyTypeNode(), {
  prefix: numberTypeNode('u64'),
  fixed: true,
});

test(mergeVisitorMacro, node, 3);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[optionTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[publicKeyTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[numberTypeNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
optionTypeNode [fixed]
|   numberTypeNode [u64]
|   publicKeyTypeNode`
);
