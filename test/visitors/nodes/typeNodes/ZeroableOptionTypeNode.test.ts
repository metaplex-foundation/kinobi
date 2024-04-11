import test from 'ava';
import {
  constantValueNodeFromBytes,
  publicKeyTypeNode,
  zeroableOptionTypeNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = zeroableOptionTypeNode(
  publicKeyTypeNode(),
  constantValueNodeFromBytes('base16', 'ff'.repeat(32))
);

test(mergeVisitorMacro, node, 5);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[zeroableOptionTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[publicKeyTypeNode]', null);
test(
  deleteNodesVisitorMacro,
  node,
  '[constantValueNode]',
  zeroableOptionTypeNode(publicKeyTypeNode())
);
test(
  getDebugStringVisitorMacro,
  node,
  `
zeroableOptionTypeNode
|   publicKeyTypeNode
|   constantValueNode
|   |   bytesTypeNode
|   |   bytesValueNode [base16.ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff]`
);

// No zero value.
test(
  'getDebugStringVisitor: different strategy',
  getDebugStringVisitorMacro,
  zeroableOptionTypeNode(publicKeyTypeNode()),
  `
zeroableOptionTypeNode
|   publicKeyTypeNode`
);
