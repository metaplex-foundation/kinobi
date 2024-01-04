import test from 'ava';
import { accountBumpValueNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = accountBumpValueNode('metadata');

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[accountBumpValueNode]', null);
test(getDebugStringVisitorMacro, node, `accountBumpValueNode [metadata]`);
