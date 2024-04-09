import test from 'ava';
import { preOffsetTypeNode, stringTypeNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = preOffsetTypeNode(stringTypeNode(), 42);

test(mergeVisitorMacro, node, 2);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[stringTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[preOffsetTypeNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
preOffsetTypeNode [42.relative]
|   stringTypeNode [utf8]`
);

// Different strategy.
test(
  'getDebugStringVisitor: different strategy',
  getDebugStringVisitorMacro,
  preOffsetTypeNode(stringTypeNode(), 42, 'absolute'),
  `
preOffsetTypeNode [42.absolute]
|   stringTypeNode [utf8]`
);
