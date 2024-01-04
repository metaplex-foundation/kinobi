import test from 'ava';
import { publicKeyValueNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = publicKeyValueNode('HqJgWgvkn5wMGU8LpzkRw8389N5Suvu2nZcmpya9JyJB');

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[publicKeyValueNode]', null);
test(
  getDebugStringVisitorMacro,
  node,
  `publicKeyValueNode [HqJgWgvkn5wMGU8LpzkRw8389N5Suvu2nZcmpya9JyJB]`
);
