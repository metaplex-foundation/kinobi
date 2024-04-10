import test from 'ava';
import {
  constantDiscriminatorNode,
  constantValueNodeFromBytes,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = constantDiscriminatorNode(
  constantValueNodeFromBytes('base16', '01020304'),
  42
);

test(mergeVisitorMacro, node, 4);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[constantDiscriminatorNode]', null);
test(deleteNodesVisitorMacro, node, '[constantValueNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
constantDiscriminatorNode [offset:42]
|   constantValueNode
|   |   bytesTypeNode
|   |   bytesValueNode [base16.01020304]`
);
