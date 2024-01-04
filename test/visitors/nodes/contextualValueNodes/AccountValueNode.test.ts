import test from 'ava';
import { accountValueNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = accountValueNode('mint');

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[accountValueNode]', null);
test(getDebugStringVisitorMacro, node, `accountValueNode [mint]`);
