import test from 'ava';
import { bytesValueNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = bytesValueNode('base64', 'SGVsbG8gV29ybGQ=');

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[bytesValueNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `bytesValueNode [base64.SGVsbG8gV29ybGQ=]`
);
