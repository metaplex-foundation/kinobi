import test from 'ava';
import { constantDiscriminatorNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = constantDiscriminatorNode([1, 2, 3, 4], 42);

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[constantDiscriminatorNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `constantDiscriminatorNode [0x01020304.offset:42]`
);
