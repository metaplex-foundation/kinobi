import test from 'ava';
import { numberTypeNode, prefixedSizeNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = prefixedSizeNode(numberTypeNode('u64'));

test(mergeVisitorMacro, node, 2);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[prefixedSizeNode]', null);
test(deleteNodesVisitorMacro, node, '[numberTypeNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
prefixedSizeNode
|   numberTypeNode [u64]`
);
