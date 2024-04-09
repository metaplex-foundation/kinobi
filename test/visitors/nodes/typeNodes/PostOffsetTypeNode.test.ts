import test from 'ava';
import { postOffsetTypeNode, stringTypeNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = postOffsetTypeNode(stringTypeNode('utf8'), 42);

test(mergeVisitorMacro, node, 2);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[stringTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[postOffsetTypeNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
postOffsetTypeNode [42.relative]
|   stringTypeNode [utf8]`
);

// Different strategy.
test(
  'getDebugStringVisitor: different strategy',
  getDebugStringVisitorMacro,
  postOffsetTypeNode(stringTypeNode('utf8'), 42, 'absolute'),
  `
postOffsetTypeNode [42.absolute]
|   stringTypeNode [utf8]`
);
