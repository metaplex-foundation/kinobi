import test from 'ava';
import { byteDiscriminatorNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = byteDiscriminatorNode([1, 2, 3, 4], 42);

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[byteDiscriminatorNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `byteDiscriminatorNode [0x01020304.offset:42]`
);
