import test from 'ava';
import { noneValueNode } from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = noneValueNode();

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[noneValueNode]', null);
test(getDebugStringVisitorMacro, node, `noneValueNode`);
