import test from 'ava';
import { bytesTypeNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = bytesTypeNode();

test(mergeVisitorMacro, node, 2);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[bytesTypeNode]', null);
test(deleteNodesVisitorMacro, node, '[remainderSizeNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `
bytesTypeNode
|   remainderSizeNode`
);
