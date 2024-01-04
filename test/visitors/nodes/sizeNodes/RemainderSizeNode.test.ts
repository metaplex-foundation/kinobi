import test from 'ava';
import { remainderSizeNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = remainderSizeNode();

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[remainderSizeNode]', null);
test(getDebugStringVisitorMacro, node, `remainderSizeNode`);
