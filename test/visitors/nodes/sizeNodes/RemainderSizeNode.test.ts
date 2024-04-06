import test from 'ava';
import { remainderCountNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = remainderCountNode();

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[remainderCountNode]', null);
test(getDebugStringVisitorMacro, node, `remainderCountNode`);
